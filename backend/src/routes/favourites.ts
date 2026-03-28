import { Router } from "express";
import { authMiddleware } from "../middleware/auth";
import {
  getAllFavourites,
  getFavouriteByCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  addItem,
  updateItem,
  deleteItem,
} from "../controllers/favouriteController";

const router = Router();

// Public
router.get("/", getAllFavourites);
router.get("/:category", getFavouriteByCategory);

// Admin — categories
router.post("/", authMiddleware, createCategory);
router.put("/:id", authMiddleware, updateCategory);
router.delete("/:id", authMiddleware, deleteCategory);

// Admin — items
router.post("/:id/items", authMiddleware, addItem);
router.put("/:id/items/:itemIndex", authMiddleware, updateItem);
router.delete("/:id/items/:itemIndex", authMiddleware, deleteItem);

export default router;