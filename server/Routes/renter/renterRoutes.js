import express from "express";
import { verifyToken } from "../../middleware/auth.js";
import {
  getProducts,
  getActiveRentals,
  getRentalHistory,
  createOrder,
} from "../../Controller/renter/renterController.js";

const router = express.Router();

router.get("/products", verifyToken, getProducts);
router.get("/rentals", verifyToken, getActiveRentals);
router.get("/history", verifyToken, getRentalHistory);
router.post("/order", verifyToken, createOrder);

export default router;