import { Router } from "express";
import {
  getProfile,
  updateProfile,
  uploadProfileImage as uploadProfileImageController,
  deleteProfileImage,
} from "../controllers/profileController";
import { authMiddleware } from "../middleware/auth";
import { uploadProfileImage } from "../middleware/upload";

const router = Router();

router.get("/", getProfile);
router.put("/", authMiddleware, updateProfile);
router.post("/images", authMiddleware, uploadProfileImage.single("image"), uploadProfileImageController);
router.delete("/images/:key", authMiddleware, deleteProfileImage);

export default router;
