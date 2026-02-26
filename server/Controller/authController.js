import { User } from "../Model/authModel.js";

export const getAll = async (req, res) => {
  try {
    const users = await User.findAll();  // Users → User
    res.status(200).json({
      success: true,
      data: users,
      message: "Data retrieved successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const save = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json({
      success: true,
      data: user,
      message: "Data saved successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};