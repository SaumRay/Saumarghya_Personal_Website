import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// Simple single-admin auth using env vars (no DB needed for admin)
// POST /api/auth/login
export const adminLogin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { password } = req.body;

    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminPassword) {
      res.status(500).json({ success: false, message: "Admin credentials not configured" });
      return;
    }

    const isMatch = await bcrypt.compare(password, adminPassword);
    if (!isMatch) {
      res.status(401).json({ success: false, message: "Invalid credentials" });
      return;
    }

    const token = jwt.sign({ id: "admin" }, process.env.JWT_SECRET as string, {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    });

    res.json({ success: true, token });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};
