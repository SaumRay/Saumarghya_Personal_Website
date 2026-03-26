import { Router } from "express";
import {
  getNotes, getAllNotes, getNoteById,
  createNote, updateNote, deleteNote,
} from "../controllers/notesController";
import { authMiddleware } from "../middleware/auth";
import { uploadProjectImage } from "../middleware/upload";

const router = Router();

router.get("/", getNotes);
router.get("/all", authMiddleware, getAllNotes);
router.get("/:id", getNoteById);
router.post("/", authMiddleware, uploadProjectImage.single("coverImage"), createNote);
router.put("/:id", authMiddleware, uploadProjectImage.single("coverImage"), updateNote);
router.delete("/:id", authMiddleware, deleteNote);

export default router;
