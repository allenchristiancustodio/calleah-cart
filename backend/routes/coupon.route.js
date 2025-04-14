import express from "express";
import { protectedRoute } from "../middleware/auth.middleware.js";
import { validateCoupon, getCoupon } from "../controllers/coupon.controller.js";

const router = express.Router();

router.get("/", protectedRoute, getCoupon);

router.post("/validate", protectedRoute, validateCoupon);

export default router;
