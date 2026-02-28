import express from "express";
import { getAllOrders, createOrder } from "../../Controller/seller/orderController.js";
import { verifyToken } from "../../middleware/auth.js";

const router = express.Router();

router.get("/", verifyToken, getAllOrders);
router.post("/", verifyToken, createOrder);

export default router;