import express from "express";
import { protectedRoute, adminRoute } from "../middleware/auth.middleware.js";
import { validateCoupon, getCoupon } from "../controllers/coupon.controller.js";

const router = express.Router();

router.get("/", protectedRoute, getCoupon);

router.post("/", protectedRoute, validateCoupon);

export default router;
