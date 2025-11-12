import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import stripeWebhookRoutes from "./src/routes/stripeWebhook.js";
import authRoutes from "./src/routes/authRoutes.js";
import orderRoutes from "./src/routes/orderRoutes.js";
import paymentRoutes from "./src/routes/payment.js";

dotenv.config();
const app = express();

/* ✅ Stripe Webhook — mount FIRST, before body parsing or CORS */
app.use("/api/stripe", stripeWebhookRoutes);

/* ✅ Normal middlewares for everything else */
app.use(
  cors({
    origin: ["http://localhost:3000", "https://weeditco.com"],
    credentials: true,
  })
);
app.use(express.json());

/* ✅ Your normal routes */
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payment", paymentRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
