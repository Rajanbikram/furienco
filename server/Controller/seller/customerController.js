import { Customer } from "../../Model/seller/customerModel.js";

// Get customers — aafno matra (sellerId filter)
export const getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.findAll({
      where: { sellerId: req.userId }, // ← KEY FIX
      order: [["date", "DESC"]],
    });
    res.status(200).json({ success: true, data: customers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};