import { Order } from "../../Model/seller/orderModel.js";
import { Op } from "sequelize";

// Get all orders
export const getAllOrders = async (req, res) => {
  try {
    const { date } = req.query;
    const where = date ? { date: { [Op.gte]: date } } : {};
    const orders = await Order.findAll({ where, order: [["date", "DESC"]] });
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create order
export const createOrder = async (req, res) => {
  try {
    const order = await Order.create(req.body);
    res.status(201).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};