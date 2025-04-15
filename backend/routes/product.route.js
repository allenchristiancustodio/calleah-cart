import express from "express";
import {
  getAllProducts,
  getFeaturedProducts,
  createProduct,
  deleteProduct,
  updateProduct,
  getRecommendedProducts,
  getProductsByCategory,
  toggleFeaturedProduct,
} from "../controllers/product.controller.js";
import { protectedRoute, adminRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/all", protectedRoute, adminRoute, getAllProducts);

router.get("/featured", getFeaturedProducts);

router.get("/category/:category", getProductsByCategory);

router.get("/recommendations", getRecommendedProducts);

router.post("/create", protectedRoute, adminRoute, createProduct);

router.patch("/toggle/:id", protectedRoute, adminRoute, toggleFeaturedProduct);

router.delete("/:id", protectedRoute, adminRoute, deleteProduct);

router.put("/:id", protectedRoute, adminRoute, updateProduct);

export default router;
