import { Listing } from "../../Model/seller/listingModel.js";
import { Rental } from "../../Model/renter/rentalModel.js";
import { RentalHistory } from "../../Model/renter/rentalHistoryModel.js";
import { Order } from "../../Model/seller/orderModel.js";
import { Customer } from "../../Model/seller/customerModel.js";
import { Op } from "sequelize";

const tenureToMonths = (tenure) => {
  if (!tenure) return 1;
  const t = tenure.toString().toLowerCase().trim();
  if (t === "monthly" || t === "1 month") return 1;
  if (t === "3 months") return 3;
  if (t === "6 months") return 6;
  if (t === "12 months" || t === "yearly") return 12;
  const parsed = parseInt(t);
  return isNaN(parsed) ? 1 : parsed;
};

export const getProducts = async (req, res) => {
  try {
    const { search, category, location } = req.query;
    const where = { status: "Active" };
    if (category && category !== "All") where.category = category;
    if (location && location !== "All") where.location = location;
    if (search) where.name = { [Op.iLike]: `%${search}%` };
    const listings = await Listing.findAll({ where });
    res.status(200).json({ success: true, data: listings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getActiveRentals = async (req, res) => {
  try {
    const rentals = await Rental.findAll({
      where: { userId: req.userId },
      order: [["createdAt", "DESC"]],
    });
    res.status(200).json({ success: true, data: rentals });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getRentalHistory = async (req, res) => {
  try {
    const history = await RentalHistory.findAll({
      where: { userId: req.userId },
      order: [["createdAt", "DESC"]],
    });
    res.status(200).json({ success: true, data: history });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createOrder = async (req, res) => {
  try {
    const { items, deliveryInfo } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: "No items in order." });
    }

    const today = new Date().toISOString().split("T")[0];
    const customerName = deliveryInfo?.name || "Unknown Customer";

    const rentals = await Promise.all(
      items.map(async (item) => {
        const months = tenureToMonths(item.tenure);
        const start = new Date();
        const end = new Date();
        end.setMonth(end.getMonth() + months);
        const startStr = start.toISOString().split("T")[0];
        const endStr = end.toISOString().split("T")[0];

        // ── Kun seller ko product ho — sellerId fetch garne ──
        const listing = await Listing.findOne({
          where: { name: item.productName },
          attributes: ["userId"],
        });
        const sellerId = listing ? listing.userId : null;

        // 1) Renter Rental table
        const rental = await Rental.create({
          userId: req.userId,
          productName: item.productName,
          startDate: startStr,
          endDate: endStr,
          status: "Active",
          orderStage: 0,
        });

        // 2) Renter RentalHistory table
        await RentalHistory.create({
          userId: req.userId,
          productName: item.productName,
          duration: item.tenure || "Monthly",
          amount: item.amount || 0,
          status: "Active",
          date: startStr,
        });

        // 3) Seller Order table — sellerId SAVE
        await Order.create({
          sellerId,
          product: item.productName,
          customer: customerName,
          period: item.tenure || "Monthly",
          amount: String(item.amount || 0),
          status: "Active",
          date: today,
        });

        // 4) Seller Customer table — sellerId SAVE
        await Customer.create({
          sellerId,
          name: customerName,
          product: item.productName,
          date: today,
          payment: "Paid",
        });

        return rental;
      })
    );

    res.status(201).json({ success: true, data: rentals });
  } catch (error) {
    console.error("createOrder error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};