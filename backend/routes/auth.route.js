import express from "express";
import {
  signup,
  login,
  logout,
  refreshToken,
  getProfile,
  verifyEmail,
  forgotPassword,
  resetPassword,
} from "../controllers/auth.controller.js";
import { protectedRoute } from "../middleware/auth.middleware.js";
const router = express.Router();

router.post("/signup", signup);

router.post("/verify-email", verifyEmail);

router.post("/login", login);

router.post("/logout", logout);

router.post("/refresh-token", refreshToken);

router.post("/forgot-password", forgotPassword);

// router.post("/reset-password/:token", resetPassword);

router.get("/check-auth", protectedRoute, getProfile);

export default router;
