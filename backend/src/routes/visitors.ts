import { Router } from "express";
import { logVisitor, getAllVisitors, deleteVisitor } from "../controllers/visitorController";
import { authMiddleware } from "../middleware/auth";

const router = Router();
router.post("/log", logVisitor);
router.get("/", authMiddleware, getAllVisitors);
router.delete("/:id", authMiddleware, deleteVisitor);

export default router;