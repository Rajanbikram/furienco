import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { connection } from "./database/db.js";

// Auth Routes
import authRoute from "./Routes/authRoute.js";

// Seller Routes
import listingRoute from "./Routes/seller/listingRoute.js";
import orderRoute from "./Routes/seller/orderRoute.js";
import customerRoute from "./Routes/seller/customerRoute.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create uploads folder if not exists
if (!fs.existsSync("uploads")) fs.mkdirSync("uploads");

const app = express();

// Middleware
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

// Serve uploaded images statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// DB Connection
connection();

// Test route
app.get("/", (req, res) => res.send("Furlenco API is running..."));

// API Routes
app.use("/api/auth", authRoute);
app.use("/api/seller/listings", listingRoute);
app.use("/api/seller/orders", orderRoute);
app.use("/api/seller/customers", customerRoute);

// Error Handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: "Something went wrong!" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});