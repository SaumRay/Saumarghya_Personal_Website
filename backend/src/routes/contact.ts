import { Router } from "express";
import { submitContact, getMessages, markAsRead } from "../controllers/contactController";
import { authMiddleware } from "../middleware/auth";

const router = Router();

router.post("/", submitContact);
router.get("/", authMiddleware, getMessages);
router.patch("/:id/read", authMiddleware, markAsRead);

export default router;
