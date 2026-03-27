import { Request, Response } from "express";
import { CategoryDetail } from "../models/categoryDetail";

const allowedCategories = ["traveller", "fitness", "professional", "college", "family", "events", "other"];

export const getAllCategoryDetails = async (_req: Request, res: Response): Promise<void> => {
  try {
    const details = await CategoryDetail.find().sort({ category: 1 });
    res.json({ success: true, data: details });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

export const getCategoryDetailByCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category } = req.params;

    if (!allowedCategories.includes(category)) {
      res.status(400).json({ success: false, message: "Invalid category" });
      return;
    }

    const detail = await CategoryDetail.findOne({ category });

    if (!detail) {
      res.json({
        success: true,
        data: {
          category,
          title: "",
          subtitle: "",
          description: "",
          stats: [],
        },
      });
      return;
    }

    res.json({ success: true, data: detail });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

export const upsertCategoryDetail = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category } = req.params;
    const { title, subtitle, description, stats } = req.body;

    if (!allowedCategories.includes(category)) {
      res.status(400).json({ success: false, message: "Invalid category" });
      return;
    }

    const parsedStats = Array.isArray(stats) ? stats : [];

    const detail = await CategoryDetail.findOneAndUpdate(
      { category },
      {
        category,
        title: title || "",
        subtitle: subtitle || "",
        description: description || "",
        stats: parsedStats.map((s: { label: string; value: string; muscleGroup?: string }) => ({
          label: s.label?.trim?.() || "",
          value: s.value?.trim?.() || "",
          muscleGroup: s.muscleGroup?.trim?.() || "",
        })).filter((s: { label: string; value: string }) => s.label && s.value),
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.json({ success: true, data: detail, message: "Category details saved successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};
