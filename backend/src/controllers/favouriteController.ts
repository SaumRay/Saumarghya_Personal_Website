import { Request, Response } from "express";
import { FavouriteCategory } from "../models/Favourite";

// Seed default categories if none exist
const DEFAULT_CATEGORIES = [
  { category: "movies-shows", label: "Movies & Shows", emoji: "🎬", isDefault: true, order: 0 },
  { category: "music-artists", label: "Music & Artists", emoji: "🎵", isDefault: true, order: 1 },
  { category: "food-cuisine", label: "Food & Cuisine", emoji: "🍜", isDefault: true, order: 2 },
  { category: "sports-teams", label: "Sports & Teams", emoji: "🏏", isDefault: true, order: 3 },
];

export const seedDefaults = async () => {
  try {
    const count = await FavouriteCategory.countDocuments();
    if (count === 0) {
      await FavouriteCategory.insertMany(DEFAULT_CATEGORIES);
      console.log("✅ Default favourite categories seeded");
    }
  } catch (error) {
    console.error("❌ Failed to seed favourite categories:", error);
  }
};

// GET all categories with their items
export const getAllFavourites = async (_req: Request, res: Response): Promise<void> => {
  try {
    const categories = await FavouriteCategory.find().sort({ order: 1, createdAt: 1 });
    res.json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

// GET single category by slug
export const getFavouriteByCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const cat = await FavouriteCategory.findOne({ category: req.params.category });
    if (!cat) { res.status(404).json({ success: false, message: "Category not found" }); return; }
    res.json({ success: true, data: cat });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

// POST create new category (admin)
export const createCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { label, emoji, order } = req.body;
    if (!label) { res.status(400).json({ success: false, message: "Label is required" }); return; }

    // Generate slug from label
    const category = label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const exists = await FavouriteCategory.findOne({ category });
    if (exists) { res.status(400).json({ success: false, message: "Category already exists" }); return; }

    const cat = await FavouriteCategory.create({
      category,
      label,
      emoji: emoji || "⭐",
      isDefault: false,
      order: order || 0,
      items: [],
    });
    res.status(201).json({ success: true, data: cat });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

// PUT update category label/emoji/order (admin)
export const updateCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const cat = await FavouriteCategory.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!cat) { res.status(404).json({ success: false, message: "Category not found" }); return; }
    res.json({ success: true, data: cat });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

// DELETE category (admin, only non-default)
export const deleteCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const cat = await FavouriteCategory.findById(req.params.id);
    if (!cat) { res.status(404).json({ success: false, message: "Category not found" }); return; }
    if (cat.isDefault) { res.status(400).json({ success: false, message: "Cannot delete default categories" }); return; }
    await cat.deleteOne();
    res.json({ success: true, message: "Category deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

// POST add item to category (admin)
export const addItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description, imageUrl, rating, order } = req.body;
    if (!name) { res.status(400).json({ success: false, message: "Name is required" }); return; }

    const cat = await FavouriteCategory.findById(req.params.id);
    if (!cat) { res.status(404).json({ success: false, message: "Category not found" }); return; }

    cat.items.push({ name, description: description || "", imageUrl: imageUrl || "", rating: rating || "", order: order || 0 });
    cat.items.sort((a, b) => a.order - b.order);
    await cat.save();
    res.status(201).json({ success: true, data: cat });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

// PUT update item in category (admin)
export const updateItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const cat = await FavouriteCategory.findById(req.params.id);
    if (!cat) { res.status(404).json({ success: false, message: "Category not found" }); return; }

    const itemIndex = cat.items.findIndex((_, i) => i === parseInt(req.params.itemIndex));
    if (itemIndex === -1) { res.status(404).json({ success: false, message: "Item not found" }); return; }

    cat.items[itemIndex] = { ...cat.items[itemIndex], ...req.body };
    await cat.save();
    res.json({ success: true, data: cat });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

// DELETE item from category (admin)
export const deleteItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const cat = await FavouriteCategory.findById(req.params.id);
    if (!cat) { res.status(404).json({ success: false, message: "Category not found" }); return; }

    cat.items = cat.items.filter((_, i) => i !== parseInt(req.params.itemIndex));
    await cat.save();
    res.json({ success: true, data: cat });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};