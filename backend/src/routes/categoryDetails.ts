import { Router } from "express";
import { authMiddleware } from "../middleware/auth";
import {
  getAllCategoryDetails,
  getCategoryDetailByCategory,
  upsertCategoryDetail,
} from "../controllers/categoryDetailController";

const router = Router();

router.get("/", getAllCategoryDetails);
router.get("/:category", getCategoryDetailByCategory);
router.put("/:category", authMiddleware, upsertCategoryDetail);

export default router;
