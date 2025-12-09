import express from "express";
import supabase from "../utils/supabaseClient.js";
import { getAllOrders } from "../controllers/orderController.js";
import { getAllSubscriptions } from "../controllers/subscriptionController.js";
import { updateOrderStatus } from "../controllers/orderController.js";
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const router = express.Router();

// Define valid ENUMs
const VALID_STATUS = ["pending", "processing", "paid", "refunded"];
const VALID_PAYMENT_STATUS = ["unpaid", "paid", "refunded"];
const VALID_PAYMENT_METHOD = ["credit_card", "paypal", "bank_transfer"];

// ✅ Match frontend mockData IDs (1, 2, 3)
const HARDCODED_SERVICES = [
  { id: "2", title: "Core", price: 250 },
  { id: "3", title: "Plus", price: 450 },
  { id: "4", title: "Pro", price: 650 },
  { id: "5", title: "Elite", price: 850 },
];

router.post("/create", async (req, res) => {
  try {
    const {
      user_id,
      total,
      payment_method,
      payment_status,
      status,
      billing,
      cartItems,
      customer,
    } = req.body;

    // 1️⃣ Validate enums
    if (!VALID_STATUS.includes(status)) {
      return res.status(400).json({ error: `Invalid order status: ${status}` });
    }

    if (!VALID_PAYMENT_STATUS.includes(payment_status)) {
      return res
        .status(400)
        .json({ error: `Invalid payment status: ${payment_status}` });
    }

    if (!VALID_PAYMENT_METHOD.includes(payment_method)) {
      return res
        .status(400)
        .json({ error: `Invalid payment method: ${payment_method}` });
    }

    // 2️⃣ Validate services based on `service_code`
    for (const item of cartItems) {
      const match = HARDCODED_SERVICES.find((s) => s.id === item.service_code);
      if (!match) {
        return res
          .status(400)
          .json({ error: `Invalid service ID: ${item.service_code}` });
      }
    }

    // 3️⃣ Insert main order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert([
        {
          user_id,
          total,
          payment_method,
          payment_status,
          status,
        },
      ])
      .select()
      .single();

    if (orderError) throw orderError;

    // 4️⃣ Insert order details
    const { error: detailsError } = await supabase
      .from("order_details")
      .insert([
        {
          order_id: order.id,
          customer_email: customer,
          phone: billing.phone,
          communication: billing.communication, // ✅ new field
        },
      ]);

    if (detailsError) throw detailsError;

    // 5️⃣ Insert order_items (no FK to services)
    const orderItems = cartItems.map((item) => ({
      order_id: order.id,
      service_code: item.service_code, // "1" | "2" | "3"
      title:
        item.title ||
        HARDCODED_SERVICES.find((s) => s.id === item.service_code)?.title,
      quantity: item.quantity || 1,
      price:
        item.price ||
        HARDCODED_SERVICES.find((s) => s.id === item.service_code)?.price,
    }));

    console.log("🛒 Final orderItems to insert:", orderItems);

    const { data: insertedItems, error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems)
      .select();

    if (itemsError) throw itemsError;

    // 6️⃣ Insert Addons — safer mapping
    const addonInserts = [];

    cartItems.forEach((item) => {
      const matchingItem = insertedItems.find(
        (inserted) => inserted.service_code === item.service_code
      );

      if (!matchingItem) {
        console.warn("⚠️ No matching order_item found for:", item.service_code);
        return;
      }

      (item.addons || []).forEach((addon) => {
        addonInserts.push({
          order_item_id: matchingItem.id, // ✅ correct FK reference
          addon_name: addon.title || addon.name,
          price: addon.price || 0,
        });
      });
    });

    if (addonInserts.length > 0) {
      const { error: addonsError } = await supabase
        .from("order_item_addons")
        .insert(addonInserts);

      if (addonsError) throw addonsError;
    }

    // ✅ All good
    res.status(200).json({
      message: "✅ Order saved successfully!",
      order_id: order.id,
      inserted_items: insertedItems,
      addons: addonInserts,
      status,
      payment_status,
      payment_method,
    });
  } catch (err) {
    console.error("❌ Failed to save order:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ GET all past orders of a user
router.get("/history/:user_id", async (req, res) => {
  const { user_id } = req.params;

  try {
    // ---------------------------------
    // 🛒 FETCH ORDERS
    // ---------------------------------
    const { data: orders, error: ordersError } = await supabase
      .from("orders")
      .select(
        `
        id,
        total,
        payment_method,
        payment_status,
        status,
        created_at,
        order_items (
          title,
          quantity,
          price
        )
      `
      )
      .eq("user_id", user_id)
      .order("created_at", { ascending: false });

    if (ordersError) throw ordersError;

    const formattedOrders = orders.map((order) => ({
      ...order,
      order_items: order.order_items.map((item) => ({
        ...item,
        total_price: item.price * item.quantity,
      })),
    }));

    // ---------------------------------
    // 🔔 FETCH SUBSCRIPTIONS
    // ---------------------------------
    const { data: subscriptions, error: subError } = await supabase
      .from("subscriptions")
      .select("id, plan_name, status, date_created, next_billing")
      .eq("user_id", user_id)
      .order("date_created", { ascending: false });

    if (subError) throw subError;

    // Map to frontend-friendly keys
    const formattedSubs = (subscriptions || []).map((sub) => ({
      id: sub.id,
      plan: sub.plan_name || "Unknown Plan",
      status: sub.status || "Unknown",
      start_date: sub.date_created || null, // exact property
      next_billing: sub.next_billing || null,
    }));

    const latestSubscription = formattedSubs.length ? formattedSubs[0] : null;

    // ---------------------------------
    // 📦 SEND RESPONSE
    // ---------------------------------
    res.status(200).json({
      orders: formattedOrders,
      subscriptions: formattedSubs,
      latest_subscription: latestSubscription,
    });
  } catch (err) {
    console.error("❌ Failed to fetch order history:", err);
    res.status(500).json({ error: err.message });
  }
});

router.get("/", getAllOrders);
router.put("/:id/status", updateOrderStatus);

export default router;
