// routes/stripeWebhook.js
import express from "express";
import Stripe from "stripe";
import dotenv from "dotenv";
import { google } from "googleapis";
import { sendEmail } from "../utils/emailService.js";

dotenv.config();
const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

function formatDateNice(date) {
  if (!date) return "N/A";
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// ---------------- GOOGLE DRIVE SETUP ----------------
const auth = new google.auth.GoogleAuth({
  keyFile: "newestcredentials.json",
  scopes: ["https://www.googleapis.com/auth/drive"],
});
const drive = google.drive({ version: "v3", auth });

// Cache
const userFolderCache = new Map();
const MAIN_FOLDER_ID = "1Pur_3HEklJM9nEDgoQHekfl3HW13M5GK";

// ------------------- Helpers -------------------
async function getOrCreateUserFolder(clientEmail) {
  if (userFolderCache.has(clientEmail)) return userFolderCache.get(clientEmail);

  const existing = await drive.files.list({
    q: `'${MAIN_FOLDER_ID}' in parents and name contains '${clientEmail}' and mimeType='application/vnd.google-apps.folder' and trashed=false`,
    fields: "files(id, name)",
  });

  if (existing.data.files.length > 0) {
    const folderId = existing.data.files[0].id;
    userFolderCache.set(clientEmail, folderId);
    return folderId;
  }

  const folder = await drive.files.create({
    resource: {
      name: `Client_${clientEmail}`,
      mimeType: "application/vnd.google-apps.folder",
      parents: [MAIN_FOLDER_ID],
    },
    fields: "id",
  });

  await drive.permissions.create({
    fileId: folder.data.id,
    requestBody: {
      type: "user",
      role: "writer",
      emailAddress: clientEmail,
    },
    fields: "id",
  });

  userFolderCache.set(clientEmail, folder.data.id);
  return folder.data.id;
}

async function createPurchaseSubfolder(userFolderId, purchaseId) {
  const subfolder = await drive.files.create({
    resource: {
      name: `Order_${purchaseId}_${Date.now()}`,
      mimeType: "application/vnd.google-apps.folder",
      parents: [userFolderId],
    },
    fields: "id",
  });

  return `https://drive.google.com/drive/folders/${subfolder.data.id}`;
}

// ------------------- WEBHOOK -------------------
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error("❌ Webhook signature verification failed:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    try {
      // ---------------- ONE-TIME PAYMENT ----------------
      if (event.type === "payment_intent.succeeded") {
        const paymentIntent = event.data.object;

        const customerEmail =
          paymentIntent.receipt_email ||
          paymentIntent.customer_email ||
          paymentIntent.charges?.data?.[0]?.billing_details?.email;

        if (!customerEmail) return res.status(200).json({ received: true });

        const userFolderId = await getOrCreateUserFolder(customerEmail);
        const folderLink = await createPurchaseSubfolder(
          userFolderId,
          paymentIntent.id
        );

        await sendEmail({
          to: customerEmail,
          subject: "✅ Payment Received – Upload Your Raw Files",
          html: `
          <div>
            <h2>Payment Confirmation</h2>
            <p>Hi ${paymentIntent.shipping?.name || "Valued Customer"},</p>
            <p>We received your payment ✅</p>
            <p><strong>Amount Paid:</strong> $${(
              paymentIntent.amount / 100
            ).toFixed(2)}</p>
            <p><strong>Order ID:</strong> ${paymentIntent.id}</p>
            <p>Please upload your raw files using the link below:</p>
            <p><a href="${folderLink}" target="_blank">${folderLink}</a></p>
          </div>
        `,
        });

        console.log("✅ One-time payment processed for:", customerEmail);
      }

      // ---------------- SUBSCRIPTION PAYMENT ----------------
      if (event.type === "invoice.payment_succeeded") {
        const invoice = event.data.object;

        console.log(
          "💰 invoice.payment_succeeded received for invoice:",
          invoice.id
        );

        const customer = await stripe.customers.retrieve(invoice.customer, {
          expand: ["subscriptions"],
        });

        const email = invoice.customer_email || customer.email;

        if (!email) {
          console.log("⚠️ No email found for invoice:", invoice.id);
          return res.status(200).json({ received: true });
        }

        // Get subscription ID
        const subscriptionId =
          invoice.subscription || customer?.subscriptions?.data?.[0]?.id;

        let subscription = null;
        let planNames = [];
        let startDate = null;
        let endDate = null;

        if (subscriptionId) {
          try {
            subscription = await stripe.subscriptions.retrieve(subscriptionId);

            // SAFE FIELDS
            const subItem = subscription.items.data[0];
            startDate = new Date(subItem.current_period_start * 1000);
            endDate = new Date(subItem.current_period_end * 1000);

            planNames = await Promise.all(
              subscription.items.data.map(async (i) => {
                if (i.price.nickname) return i.price.nickname; // use nickname if available
                // Fetch product info
                const product = await stripe.products.retrieve(i.price.product);
                return product.name || product.id; // fallback to ID if name is missing
              })
            );
          } catch (err) {
            console.error(
              "❌ Failed to fetch subscription for invoice:",
              invoice.id,
              err.message
            );
          }
        }

        const userFolderId = await getOrCreateUserFolder(email);
        const folderLink = await createPurchaseSubfolder(
          userFolderId,
          invoice.id
        );

        await sendEmail({
          to: email,
          subject: subscriptionId
            ? "🎉 Subscription Activated!"
            : "✅ Payment Received",
          html: `
      <div>
        <h2>${
          subscriptionId ? "Subscription Confirmation" : "Payment Confirmation"
        }</h2>
        <p>Hi ${customer.name || "Valued Customer"},</p>
        ${
          subscriptionId
            ? `
              <p>Your subscription is now <strong>ACTIVE</strong> 🚀</p>
              <p><strong>Plan:</strong> ${planNames.join(", ")}</p>
              <p><strong>Start:</strong> ${formatDateNice(startDate)}</p>
              <p><strong>Next Billing:</strong> ${formatDateNice(endDate)}</p>
            `
            : `
              <p>We received your payment ✅</p>
              <p><strong>Amount Paid:</strong> $${(
                invoice.amount_paid / 100
              ).toFixed(2)}</p>
            `
        }
        <p>Upload your raw files here:</p>
        <p><a href="${folderLink}" target="_blank">${folderLink}</a></p>
      </div>
    `,
        });

        console.log("📧 Email sent successfully to:", email);
        console.log("✅ Invoice processed for:", email);
      }
    } catch (err) {
      console.error("❌ Error processing webhook:", err.message);
    }

    res.status(200).json({ received: true });
  }
);

export default router;
