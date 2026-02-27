import { User } from "../Model/authModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Register
export const register = async (req, res) => {
  try {
    const { customerName, customerEmail, password } = req.body;

    // Validate required fields
    if (!customerName || !customerEmail || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required!"
      });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ where: { customerEmail } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already registered!"
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      customerName,
      customerEmail,
      password: hashedPassword
    });

    res.status(201).json({
      success: true,
      message: "Account created successfully!",
      data: {
        id: user.id,
        customerName: user.customerName,
        customerEmail: user.customerEmail
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

    // Validate fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required!"
      });
    }

    // Find user
    const user = await User.findOne({ where: { customerEmail: email } });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found!"
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid password!"
      });
    }

    // Generate token
    const token = jwt.sign(
      { id: user.id, email: user.customerEmail },
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
        customerEmail: user.customerEmail
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
      attributes: { exclude: ["password"] }  // never send password
    });
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};