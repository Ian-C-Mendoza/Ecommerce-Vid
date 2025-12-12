import express from "express";
import Stripe from "stripe";
import { sendEmail } from "../utils/emailService.js";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY // must be service role!!!
);

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// ======================
// GET Subscription Info
// ======================
router.get("/subscription-info/:subscriptionId", async (req, res) => {
  try {
    const { subscriptionId } = req.params;
    if (!subscriptionId)
      return res.status(400).json({ error: "Missing subscriptionId" });

    // Fetch subscription from Stripe
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);

    // Extract relevant info
    const subscriptionInfo = {
      serviceName:
        subscription.items.data[0]?.price?.nickname || "Subscription Service",
      startDate: subscription.start_date * 1000, // Stripe timestamps are in seconds
      currentPeriodEnd: subscription.current_period_end * 1000,
      status: subscription.status,
    };

    res.json(subscriptionInfo);
  } catch (err) {
    console.error("❌ Error fetching subscription info:", err);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/payment/attach-payment-method
router.post("/attach-payment-method", async (req, res) => {
  try {
    const { subscriptionId, email } = req.body;

    if (!subscriptionId || !email) {
      return res
        .status(400)
        .json({ error: "subscriptionId and email are required" });
    }

    // Retrieve the subscription from Stripe
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);

    if (!subscription) {
      return res.status(404).json({ error: "Subscription not found" });
    }

    const customerId = subscription.customer;

    // Create a SetupIntent to attach a payment method to the subscription
    const setupIntent = await stripe.setupIntents.create({
      customer: customerId,
      payment_method_types: ["card"],
      usage: "off_session",
      metadata: {
        subscriptionId,
        email,
      },
    });

    res.json({ clientSecret: setupIntent.client_secret });
  } catch (err) {
    console.error("❌ Attach payment method error:", err);
    res.status(500).json({ error: err.message });
  }
});
// =============================
// ONE-TIME PAYMENT
// =============================
router.post("/create-payment-intent", async (req, res) => {
  try {
    const { amount, email } = req.body;
    if (!amount || !email)
      return res.status(400).json({ error: "Amount and email are required" });

    const paymentIntent = await stripe.paymentIntents.create({
      amount, // in cents
      currency: "usd",
      receipt_email: email,
      automatic_payment_methods: { enabled: true },
    });

    res.json({ clientSecret: paymentIntent.client_secret, type: "one_time" });
  } catch (err) {
    console.error("❌ Stripe PaymentIntent Error:", err);
    res.status(500).json({ error: err.message });
  }
});

// =============================
// RECURRING SUBSCRIPTION
// =============================

router.post("/create-subscription", async (req, res) => {
  try {
    const { email, priceId, paymentMethodId, customPackage } = req.body;

    if (!email || (!priceId && !customPackage)) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // 1️⃣ Find or create customer
    const customers = await stripe.customers.list({ email, limit: 1 });
    let customer = customers.data[0];

    if (!customer) {
      customer = await stripe.customers.create({ email });
      console.log("➕ New customer created:", customer.id);
    }

    // 2️⃣ If NO paymentMethod → create SetupIntent
    if (!paymentMethodId) {
      const setupIntent = await stripe.setupIntents.create({
        customer: customer.id,
        payment_method_types: ["card"],
      });

      return res.json({ clientSecret: setupIntent.client_secret });
    }

    // 3️⃣ Handle custom package price dynamically
    let finalPriceId = priceId;

    if (customPackage) {
      // Create a Stripe Product for this custom package
      const product = await stripe.products.create({
        name: `Custom Package for ${email}`,
      });

      // Create a Stripe Price object (recurring monthly)
      const price = await stripe.prices.create({
        product: product.id,
        unit_amount: Math.round(customPackage.price * 100), // in cents
        currency: "usd",
        recurring: { interval: "month" },
      });

      finalPriceId = price.id;
    }

    // 4️⃣ Create subscription (existing flow)
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: finalPriceId }],
      default_payment_method: paymentMethodId,
      expand: ["latest_invoice.payment_intent"],
    });

    console.log("🎉 Subscription created:", subscription.id);

    const latestInvoice = subscription.latest_invoice;
    const paymentIntent = latestInvoice?.payment_intent;

    // 5️⃣ Prepare subscription info for DB
    const subItem = subscription.items.data[0];
    const date_created = new Date(subItem.current_period_start * 1000);
    const next_billing = new Date(subItem.current_period_end * 1000);

    const planNames = customPackage
      ? [`Custom Package: ${customPackage.title}`]
      : await Promise.all(
          subscription.items.data.map(async (i) => {
            if (i.price.nickname) return i.price.nickname;
            const product = await stripe.products.retrieve(i.price.product);
            return product.name || product.id;
          })
        );

    // 6️⃣ Fetch user ID from Supabase
    const { data: userData, error: userErr } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .single();

    if (userErr || !userData) {
      console.error("❌ Supabase user lookup failed:", userErr);
      return res.status(400).json({ error: "User not found in DB" });
    }

    // 7️⃣ Insert into subscriptions table
    const { error: insertErr } = await supabase.from("subscriptions").insert([
      {
        user_id: userData.id,
        plan_name: planNames.join(", "),
        date_created,
        next_billing,
        status: "active",
        stripe_subscription_id: subscription.id,
        custom_details: customPackage ? JSON.stringify(customPackage) : null,
      },
    ]);

    if (insertErr) console.error("❌ Supabase insert failed:", insertErr);
    else console.log("🟢 Subscription saved in DB!");

    // 8️⃣ Respond to frontend
    return res.json({
      subscriptionId: subscription.id,
      clientSecret: paymentIntent?.client_secret || null,
    });
  } catch (err) {
    console.error("❌ Subscription Error:", err);
    return res.status(500).json({ error: err.message });
  }
});

// =============================
// CANCEL SUBSCRIPTION
// =============================
router.post("/cancel-subscription/:localSubId", async (req, res) => {
  try {
    const { localSubId } = req.params;

    if (!localSubId) {
      return res.status(400).json({ error: "Missing local subscription ID" });
    }

    // 1️⃣ Fetch subscription from Supabase
    const { data: subData, error: subErr } = await supabase
      .from("subscriptions")
      .select("id, stripe_subscription_id")
      .eq("id", localSubId)
      .single();

    if (subErr || !subData) {
      console.error("❌ Failed to fetch subscription:", subErr);
      return res.status(404).json({ error: "Subscription not found in DB" });
    }

    const stripeSubscriptionId = subData.stripe_subscription_id;
    if (!stripeSubscriptionId) {
      return res.status(400).json({
        error: "No Stripe subscription ID found for this record",
      });
    }

    // 2️⃣ Cancel in Stripe (end of billing period)
    const canceledStripeSub = await stripe.subscriptions.update(
      stripeSubscriptionId,
      {
        cancel_at_period_end: true,
      }
    );

    // Extract updated period end
    const periodEnd = new Date(canceledStripeSub.current_period_end * 1000);

    // 3️⃣ Update Supabase status + next_billing
    const { error: updateErr } = await supabase
      .from("subscriptions")
      .update({
        status: "canceled",
        next_billing: periodEnd, // 🔥 update billing end
        date_canceled: new Date(), // 🔥 optional but recommended
      })
      .eq("id", localSubId);

    if (updateErr) {
      console.error("❌ Failed updating DB:", updateErr);
      return res.status(500).json({ error: "Failed to update DB record" });
    }

    return res.json({
      message: "Subscription canceled successfully",
      stripeStatus: canceledStripeSub.status,
      nextBilling: periodEnd,
    });
  } catch (err) {
    console.error("❌ Cancel subscription error:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
