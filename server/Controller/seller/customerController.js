import { Customer } from "../../Model/seller/customerModel.js";

// Get all customers
export const getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.findAll({ order: [["date", "DESC"]] });
    res.status(200).json({ success: true, data: customers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};