import { Request, Response } from "express";
import { Visitor } from "../models/Visitor";

// POST /api/visitors/log
// Called on first visit or repeat visit from frontend
export const logVisitor = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, fingerprint } = req.body;

    if (!fingerprint) {
      res.status(400).json({ success: false, message: "Fingerprint required" });
      return;
    }

    const existing = await Visitor.findOne({ fingerprint });

    if (existing) {
      // Repeat visitor — increment count and update last visit
      existing.visitCount += 1;
      existing.lastVisit = new Date();
      // Update name only if they provided one this time and didn't before
      if (name && name !== "Anonymous" && existing.name === "Anonymous") {
        existing.name = name;
      }
      await existing.save();
      res.json({ success: true, data: existing, isNew: false });
    } else {
      // First time visitor
      const visitor = await Visitor.create({
        name: name || "Anonymous",
        fingerprint,
        visitCount: 1,
        firstVisit: new Date(),
        lastVisit: new Date(),
      });
      res.status(201).json({ success: true, data: visitor, isNew: true });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

// GET /api/visitors — admin only
export const getAllVisitors = async (_req: Request, res: Response): Promise<void> => {
  try {
    const visitors = await Visitor.find().sort({ lastVisit: -1 });
    res.json({ success: true, data: visitors, total: visitors.length });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

// DELETE /api/visitors/:id — admin only
export const deleteVisitor = async (req: Request, res: Response): Promise<void> => {
  try {
    await Visitor.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Visitor deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};