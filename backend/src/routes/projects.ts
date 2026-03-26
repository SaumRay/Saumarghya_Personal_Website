import { Router } from "express";
import {
  getProjects,
  getFeaturedProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} from "../controllers/projectController";
import { authMiddleware } from "../middleware/auth";
import { uploadProjectImage } from "../middleware/upload";

const router = Router();

router.get("/", getProjects);
router.get("/featured", getFeaturedProjects);
router.get("/:id", getProjectById);
router.post("/", authMiddleware, uploadProjectImage.single("image"), createProject);
router.put("/:id", authMiddleware, uploadProjectImage.single("image"), updateProject);
router.delete("/:id", authMiddleware, deleteProject);

export default router;
