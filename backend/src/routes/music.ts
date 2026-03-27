import { Router } from "express";
import { authMiddleware } from "../middleware/auth";
import { uploadAudio } from "../middleware/upload";
import {
  getVideos, addVideo, updateVideo, deleteVideo,
  getAudioTracks, uploadAudioTrack, deleteAudioTrack
} from "../controllers/musicController";

const router = Router();

// Public
router.get("/videos", getVideos);
router.get("/audio", getAudioTracks);

// Admin protected
router.post("/videos", authMiddleware, addVideo);
router.put("/videos/:id", authMiddleware, updateVideo);
router.delete("/videos/:id", authMiddleware, deleteVideo);
router.post("/audio", authMiddleware, uploadAudio.single("audio"), uploadAudioTrack);
router.delete("/audio/:id", authMiddleware, deleteAudioTrack);

export default router;