import express from "express";
import { getAllOrders, createOrder } from "../../Controller/seller/orderController.js";

const router = express.Router();

router.get("/", getAllOrders);
router.post("/", createOrder);

export default router;