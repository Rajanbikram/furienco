import express from "express";
import { upload } from "../../middleware/upload.js";
import { verifyToken } from "../../middleware/auth.js";
import {
  getAllListings,
  createListing,
  updateListing,
  deleteListing,
} from "../../Controller/seller/listingController.js";

const router = express.Router();

router.get("/", verifyToken, getAllListings);
router.post("/", verifyToken, upload.single("image"), createListing);
router.put("/:id", verifyToken, upload.single("image"), updateListing);
router.delete("/:id", verifyToken, deleteListing);

export default router;