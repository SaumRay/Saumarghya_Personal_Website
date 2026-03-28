import { Request, Response } from "express";
import { FavouriteCategory } from "../models/Favourite";

const DEFAULT_CATEGORIES = [
  { category: "movies-shows", label: "Movies & Shows", emoji: "🎬", isDefault: true, order: 0, note: "" },
  { category: "music-artists", label: "Music & Artists", emoji: "🎵", isDefault: true, order: 1, note: "" },
  { category: "food-cuisine", label: "Food & Cuisine", emoji: "🍜", isDefault: true, order: 2, note: "" },
  { category: "sports-teams", label: "Sports & Teams", emoji: "🏏", isDefault: true, order: 3, note: "" },
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

export const getAllFavourites = async (_req: Request, res: Response): Promise<void> => {
  try {
    const categories = await FavouriteCategory.find().sort({ order: 1, createdAt: 1 });
    res.json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

export const getFavouriteByCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const cat = await FavouriteCategory.findOne({ category: req.params.category });
    if (!cat) { res.status(404).json({ success: false, message: "Category not found" }); return; }
    res.json({ success: true, data: cat });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

export const createCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { label, emoji, order, note } = req.body;
    if (!label) { res.status(400).json({ success: false, message: "Label is required" }); return; }

    const category = label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const exists = await FavouriteCategory.findOne({ category });
    if (exists) { res.status(400).json({ success: false, message: "Category already exists" }); return; }

    const cat = await FavouriteCategory.create({
      category, label, emoji: emoji || "⭐",
      note: note || "", isDefault: false, order: order || 0, items: [],
    });
    res.status(201).json({ success: true, data: cat });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

export const updateCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const cat = await FavouriteCategory.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!cat) { res.status(404).json({ success: false, message: "Category not found" }); return; }
    res.json({ success: true, data: cat });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

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

export const addItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description, imageUrl, rating, isTop3, order, musicType, artistName, songUrl, language } = req.body;
    if (!name) { res.status(400).json({ success: false, message: "Name is required" }); return; }

    const cat = await FavouriteCategory.findById(req.params.id);
    if (!cat) { res.status(404).json({ success: false, message: "Category not found" }); return; }

    if (isTop3) {
      if (musicType) {
        const typeTop3Count = cat.items.filter(i => i.isTop3 && i.musicType === musicType).length;
        if (typeTop3Count >= 3) {
          res.status(400).json({ success: false, message: `Top 3 ${musicType === "artist" ? "artists" : "songs"} limit reached` });
          return;
        }
      } else {
        const top3Count = cat.items.filter(i => i.isTop3).length;
        if (top3Count >= 3) {
          res.status(400).json({ success: false, message: "You can only have 3 Top picks. Remove one first." });
          return;
        }
      }
    }

    cat.items.push({
      name,
      description: description || "",
      imageUrl: imageUrl || "",
      rating: rating || "",
      isTop3: isTop3 || false,
      order: order || 0,
      musicType: musicType || undefined,
      artistName: artistName || "",
      songUrl: songUrl || "",
      language: language || "",
    });
    cat.items.sort((a, b) => a.order - b.order);
    await cat.save();
    res.status(201).json({ success: true, data: cat });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

export const updateItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const cat = await FavouriteCategory.findById(req.params.id);
    if (!cat) { res.status(404).json({ success: false, message: "Category not found" }); return; }

    const itemIndex = parseInt(req.params.itemIndex);
    if (itemIndex < 0 || itemIndex >= cat.items.length) {
      res.status(404).json({ success: false, message: "Item not found" }); return;
    }

    const currentItem = cat.items[itemIndex];
    const incomingIsTop3 = req.body.isTop3 === true;
    const wasAlreadyTop3 = currentItem.isTop3 === true;
    const musicType = req.body.musicType || currentItem.musicType;

    // Only check limit if we're newly setting isTop3 to true
    if (incomingIsTop3 && !wasAlreadyTop3) {
      if (musicType) {
        const typeTop3Count = cat.items.filter(
          (i, idx) => i.isTop3 && i.musicType === musicType && idx !== itemIndex
        ).length;
        if (typeTop3Count >= 3) {
          res.status(400).json({ success: false, message: `Top 3 ${musicType === "artist" ? "artists" : "songs"} limit reached` });
          return;
        }
      } else {
        const top3Count = cat.items.filter((i, idx) => i.isTop3 && idx !== itemIndex).length;
        if (top3Count >= 3) {
          res.status(400).json({ success: false, message: "You can only have 3 Top picks. Remove one first." });
          return;
        }
      }
    }

    cat.items[itemIndex] = { ...cat.items[itemIndex], ...req.body };
    await cat.save();
    res.json({ success: true, data: cat });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

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

export const uploadFavouriteImageController = async (req: Request, res: Response): Promise<void> => {
  try {
    const file = req.file as Express.MulterS3.File;
    if (!file) {
      res.status(400).json({ success: false, message: "No file uploaded" });
      return;
    }
    res.status(201).json({ success: true, url: file.location, key: file.key });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};