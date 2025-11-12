import express from "express";
import {
  register,
  login,
  logout,
  getUser,
  refreshToken,
} from "../controllers/authController.js";

const router = express.Router();

// @route   POST /api/auth/register
router.post("/register", register);

// @route   POST /api/auth/login
router.post("/login", login);

// @route   GET /api/auth/user
router.get("/user", getUser);

router.post("/logout", logout);

router.post("/refresh", refreshToken); // 👈 new endpoint

export default router;
