import { Router } from "express";
import { authMiddleware } from "../middleware/auth";
import { uploadAudio, uploadVideo } from "../middleware/upload";
import {
  getVideos, addVideo, updateVideo, deleteVideo,
  getAudioTracks, uploadAudioTrack, deleteAudioTrack,
  getVideoFiles, uploadVideoFile, deleteVideoFile
} from "../controllers/musicController";

const router = Router();

// Public
router.get("/videos", getVideos);
router.get("/audio", getAudioTracks);
router.get("/videofiles", getVideoFiles);

// Admin — Instagram videos
router.post("/videos", authMiddleware, addVideo);
router.put("/videos/:id", authMiddleware, updateVideo);
router.delete("/videos/:id", authMiddleware, deleteVideo);

// Admin — Audio
router.post("/audio", authMiddleware, uploadAudio.single("audio"), uploadAudioTrack);
router.delete("/audio/:id", authMiddleware, deleteAudioTrack);

// Admin — Local video files
router.post("/videofiles", authMiddleware, uploadVideo.single("video"), uploadVideoFile);
router.delete("/videofiles/:id", authMiddleware, deleteVideoFile);

export default router;