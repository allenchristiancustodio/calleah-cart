import express from "express";
import { protectedRoute } from "../middleware/auth.middleware.js";
import {
  addToCart,
  removeAllFromCart,
  removeFromCart,
  updateQuantityFromCart,
  getCartProducts,
} from "../controllers/cart.controller.js";

const router = express.Router();

router.get("/items", protectedRoute, getCartProducts);

router.post("/item", protectedRoute, addToCart);

router.delete("/item", protectedRoute, removeAllFromCart);

router.put("/item/:id", protectedRoute, updateQuantityFromCart);

export default router;
