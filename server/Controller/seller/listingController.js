import { Listing } from "../../Model/seller/listingModel.js";

// Get only logged-in user's listings
export const getAllListings = async (req, res) => {
  try {
    const listings = await Listing.findAll({ where: { userId: req.userId } });
    res.status(200).json({ success: true, data: listings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create listing with userId from token
export const createListing = async (req, res) => {
  try {
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
    const listing = await Listing.create({ ...req.body, userId: req.userId, imageUrl });
    res.status(201).json({ success: true, data: listing });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update listing (only owner)
export const updateListing = async (req, res) => {
  try {
    const { id } = req.params;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : undefined;
    const updateData = imageUrl ? { ...req.body, imageUrl } : req.body;
    await Listing.update(updateData, { where: { id, userId: req.userId } });
    const updated = await Listing.findByPk(id);
    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete listing (only owner)
export const deleteListing = async (req, res) => {
  try {
    const { id } = req.params;
    await Listing.destroy({ where: { id, userId: req.userId } });
    res.status(200).json({ success: true, message: "Listing deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};