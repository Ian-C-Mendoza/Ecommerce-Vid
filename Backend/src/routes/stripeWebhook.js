// routes/stripeWebhook.js
import express from "express";
import Stripe from "stripe";
import dotenv from "dotenv";
import { google } from "googleapis";
import { sendEmail } from "../utils/emailService.js";
import fs from "fs";
import path from "path";

dotenv.config();
const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// ---------------- GOOGLE DRIVE SETUP ----------------
const auth = new google.auth.GoogleAuth({
  keyFile: "new-credentials.json", // your service account JSON
  scopes: ["https://www.googleapis.com/auth/drive"],
});
const drive = google.drive({ version: "v3", auth });

// In-memory cache (you can replace with DB later)
const userFolderCache = new Map();

// Your main folder ID in Google Drive (shared parent)
const MAIN_FOLDER_ID = "1WmHYwKBvtzJghEBoj-akkk1BQtpfCm0J";

// ----------------------------------------------------
// ✅ Ensure a user has a main folder (reuses if exists)
async function getOrCreateUserFolder(clientEmail) {
  // Check cache first (or use DB if persistent)
  if (userFolderCache.has(clientEmail)) {
    return userFolderCache.get(clientEmail);
  }

  // Search for existing folder in Drive
  const existing = await drive.files.list({
    q: `'${MAIN_FOLDER_ID}' in parents and name contains '${clientEmail}' and mimeType='application/vnd.google-apps.folder' and trashed=false`,
    fields: "files(id, name)",
  });

  if (existing.data.files.length > 0) {
    const folderId = existing.data.files[0].id;
    userFolderCache.set(clientEmail, folderId);
    return folderId;
  }

  // Otherwise, create new folder
  const folder = await drive.files.create({
    resource: {
      name: `Client_${clientEmail}`,
      mimeType: "application/vnd.google-apps.folder",
      parents: [MAIN_FOLDER_ID],
    },
    fields: "id",
  });

  const folderId = folder.data.id;

  // Give write access ONCE
  await drive.permissions.create({
    fileId: folderId,
    requestBody: {
      type: "user",
      role: "writer",
      emailAddress: clientEmail,
    },
    fields: "id",
  });

  // Cache folder ID
  userFolderCache.set(clientEmail, folderId);
  return folderId;
}

// ----------------------------------------------------
// ✅ Create a subfolder for each purchase inside user's main folder
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

// ----------------------------------------------------
// STRIPE WEBHOOK HANDLER
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

    // ✅ Handle successful payments
    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object;

      const customerEmail =
        paymentIntent.receipt_email ||
        paymentIntent.customer_email ||
        paymentIntent.charges?.data?.[0]?.billing_details?.email;

      if (!customerEmail) {
        console.warn("⚠️ No customer email found.");
        return res.status(200).json({ received: true });
      }

      try {
        // 1️⃣ Ensure the user has a main folder (reuse if already exists)
        const userFolderId = await getOrCreateUserFolder(customerEmail);

        // 2️⃣ Create a subfolder for this purchase
        const folderLink = await createPurchaseSubfolder(
          userFolderId,
          paymentIntent.id
        );
        console.log("✅ Folder created:", folderLink);

        // 3️⃣ Send email with the subfolder link
        await sendEmail({
          to: customerEmail,
          subject: "✅ Payment Received – Upload Your Raw Files",
          html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9fafb;">
            <div style="max-width: 600px; margin: auto; background: #fff; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.05);">
              <div style="background: #4f46e5; color: #fff; padding: 20px;">
                <h1>Payment Confirmation</h1>
              </div>
              <div style="padding: 30px; color: #333;">
                <p>Hi ${paymentIntent.shipping?.name || "Valued Customer"},</p>
                <p>We received your payment ✅</p>
                <p><strong>Amount Paid:</strong> $${(
                  paymentIntent.amount / 100
                ).toFixed(2)}</p>
                <p><strong>Order ID:</strong> ${paymentIntent.id}</p>
                <p>Please upload your raw files using the link below:</p>
                <p><a href="${folderLink}" target="_blank">${folderLink}</a></p>
                <p>Thank you for your business!</p>
              </div>
              <div style="background: #f3f4f6; text-align: center; padding: 15px; font-size: 12px; color: #555;">
                © ${new Date().getFullYear()} Ecommerce Store
              </div>
            </div>
          </div>
        `,
        });

        console.log("✅ Email sent to:", customerEmail);
      } catch (err) {
        console.error("❌ Error processing payment:", err.message);
      }
    }

    res.status(200).json({ received: true });
  }
);

export default router;
