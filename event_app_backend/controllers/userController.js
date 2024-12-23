import User from '../models/userModel.js';
import asyncHandler from 'express-async-handler';

// Fetch All Users
export const getAllUsers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, role } = req.query;

  const query = role ? { role } : {}; // Filter users by role if provided

  try {
    const users = await User.find(query)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const totalUsers = await User.countDocuments(query);

    res.json({
      users,
      currentPage: Number(page),
      totalPages: Math.ceil(totalUsers / limit),
      totalUsers,
    });
  } catch (error) {
    res.status(500);
    throw new Error('Error fetching users');
  }
});

export const handlerDeleteUser = async (req, res) => {
  const { id } = req.query;
  if (req.method === "DELETE") {
    try {
      await User.findByIdAndDelete(id);
      res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting user", error });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
};

export const handlerEditUser = async (req, res) => {
  const { id } = req.query;
  if (req.method === "PUT") {
    try {
      const updatedUser = await User.findByIdAndUpdate(id, req.body, { new: true });
      res.status(200).json(updatedUser);
    } catch (error) {
      res.status(500).json({ message: "Error updating user", error });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
};
