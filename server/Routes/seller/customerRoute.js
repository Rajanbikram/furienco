import express from "express";
import { getAllCustomers } from "../../Controller/seller/customerController.js";
import { verifyToken } from "../../middleware/auth.js";

const router = express.Router();

router.get("/", verifyToken, getAllCustomers);

export default router;