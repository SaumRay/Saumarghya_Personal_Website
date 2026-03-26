import { Router } from "express";
import {
  getGalleries, getGalleryById, createGallery, updateGallery,
  uploadGalleryImages, deleteGalleryImage, deleteGallery,
} from "../controllers/galleryController";
import { authMiddleware } from "../middleware/auth";
import { uploadProjectImage } from "../middleware/upload";

const router = Router();

router.get("/", getGalleries);
router.get("/:id", getGalleryById);
router.post("/", authMiddleware, createGallery);
router.put("/:id", authMiddleware, updateGallery);
router.post("/:id/images", authMiddleware, uploadProjectImage.array("images", 20), uploadGalleryImages);
router.delete("/:id/images/:key", authMiddleware, deleteGalleryImage);
router.delete("/:id", authMiddleware, deleteGallery);

export default router;
