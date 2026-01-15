// --------------------
// 📌 YOUR OLD VERSION (KEPT AS COMMENT)
// --------------------

// import express from "express";
// import cors from "cors";
// import dotenv from "dotenv";
// import stripeWebhookRoutes from "./src/routes/stripeWebhook.js";
// import authRoutes from "./src/routes/authRoutes.js";
// import subscriptionRoutes from "./src/routes/subscriptionRoutes.js";
// import orderRoutes from "./src/routes/orderRoutes.js";
// import paymentRoutes from "./src/routes/payment.js";

// dotenv.config();
// const app = express();

// /* ✅ Stripe Webhook — mount FIRST, before body parsing or CORS */
// app.use("/api/stripe", stripeWebhookRoutes);

// /* ✅ Normal middlewares for everything else */
// app.use(
//   cors({
//     origin: ["http://localhost:3000", "https://weeditco.com"],
//     credentials: true,
//   })
// );
// app.use(express.json());

// /* ✅ Your normal routes */
// app.use("/api/auth", authRoutes);
// app.use("/api/orders", orderRoutes);
// app.use("/api/subscriptions", subscriptionRoutes);
// app.use("/api/payment", paymentRoutes);

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));

// ===================================================================
// 🚀 UPDATED VERSION FOR RENDER + NETLIFY
// ===================================================================

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import stripeWebhookRoutes from "./src/routes/stripeWebhook.js";
import authRoutes from "./src/routes/authRoutes.js";
import subscriptionRoutes from "./src/routes/subscriptionRoutes.js";
import orderRoutes from "./src/routes/orderRoutes.js";
import paymentRoutes from "./src/routes/payment.js";

dotenv.config();
const app = express();

/* -----------------------------------------
   ⚠️ STRIPE WEBHOOK MUST BE FIRST
------------------------------------------ */
app.use("/api/stripe", stripeWebhookRoutes);

/* -----------------------------------------
   🌐 CORS — update with your real Netlify URL
------------------------------------------ */
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:5173",
      "https://www.weeditco.com",
      "https://weeditco.com",
      "https://weeditco.netlify.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// ✅ THIS LINE IS CRITICAL
app.options("*", cors());

/* -----------------------------------------
   🧩 JSON parser (after Stripe webhook)
------------------------------------------ */
app.use(express.json());

/* -----------------------------------------
   🚏 Normal API routes
------------------------------------------ */
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/subscriptions", subscriptionRoutes);
app.use("/api/payment", paymentRoutes);

/* -----------------------------------------
   ❤️ Render Health Check Route
------------------------------------------ */
app.get("/", (req, res) => {
  res.send("API is running successfully...");
});

/* -----------------------------------------
   🚀 Start Server
------------------------------------------ */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
