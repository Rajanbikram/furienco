import express from "express";
import { getAllCustomers } from "../../Controller/seller/customerController.js";

const router = express.Router();

router.get("/", getAllCustomers);

export default router;