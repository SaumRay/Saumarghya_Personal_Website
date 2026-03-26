import { Router } from "express";
import {
  getGalleries, getGalleryById, getGalleryByCategory, createGallery, updateGallery,
  uploadGalleryImages, deleteGalleryImage, deleteGallery,
} from "../controllers/galleryController";
import { authMiddleware } from "../middleware/auth";
import { uploadProjectImage } from "../middleware/upload";

const router = Router();

router.get("/", getGalleries);
router.get("/category/:category", getGalleryByCategory);
router.get("/:id", getGalleryById);
router.post("/", authMiddleware, createGallery);
router.put("/:id", authMiddleware, updateGallery);

router.post("/:id/images", authMiddleware, (req, res, next) => {
  uploadProjectImage.array("images", 20)(req, res, (err: any) => {
    if (err) {
      console.error("Multer upload error:", err);
      return res.status(400).json({
        success: false,
        message: err.message || "Upload failed",
      });
    }
    next();
  });
}, uploadGalleryImages);

router.delete("/:id/images/:key", authMiddleware, deleteGalleryImage);
router.delete("/:id", authMiddleware, deleteGallery);

export default router;
