import { User } from "../Model/authModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Register
export const register = async (req, res) => {
  try {
    const { customerName, customerEmail, customerPhone, customerAddress, password, role } = req.body;

    if (!customerName || !customerEmail || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required!"
      });
    }

    const existingUser = await User.findOne({ where: { customerEmail } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already registered!"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      customerName,
      customerEmail,
      password: hashedPassword,
      role: role || "renter"   // role save garne
    });

    res.status(201).json({
      success: true,
      message: "Account created successfully!",
      data: {
        id: user.id,
        customerName: user.customerName,
        customerEmail: user.customerEmail,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required!"
      });
    }

    const user = await User.findOne({ where: { customerEmail: email } });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found!"
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid password!"
      });
    }

    const token = jwt.sign(
      { id: user.id, email: user.customerEmail, role: user.role },
      process.env.JWT_SECRET || "furlenco_secret",
      { expiresIn: "1d" }
    );

    res.status(200).json({
      success: true,
      message: "Login successful!",
      token,
      data: {
        id: user.id,
        customerName: user.customerName,
        customerEmail: user.customerEmail,
        role: user.role    // role return garne
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get All Users
export const getAll = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ["password"] }
    });
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};