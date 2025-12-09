import express from "express";
import { getAllSubscriptions } from "../controllers/subscriptionController.js";

const router = express.Router();

// ✅ Correct endpoint
router.get("/", getAllSubscriptions);

export default router;
