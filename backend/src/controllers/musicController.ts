import { Request, Response } from "express";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { MusicVideo, AudioTrack } from "../models/Music";
import { s3, S3_BUCKET } from "../config/s3";

export const getVideos = async (_req: Request, res: Response): Promise<void> => {
  try {
    const videos = await MusicVideo.find().sort({ order: 1, createdAt: -1 });
    res.json({ success: true, data: videos });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

export const addVideo = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description, instagramUrl, order } = req.body;
    if (!instagramUrl || !title) {
      res.status(400).json({ success: false, message: "Title and Instagram URL are required" });
      return;
    }

    // Fetch oEmbed HTML from Instagram
    let embedHtml = "";
    try {
      const oembedRes = await fetch(
        `https://graph.facebook.com/v18.0/instagram_oembed?url=${encodeURIComponent(instagramUrl)}&access_token=public`
      );
      const oembedData = await oembedRes.json() as { html?: string };
      embedHtml = oembedData.html || "";
    } catch {
      // oEmbed failed, frontend will fallback to iframe
    }

    const video = await MusicVideo.create({ title, description, instagramUrl, embedHtml, order: order || 0 });
    res.status(201).json({ success: true, data: video });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

export const updateVideo = async (req: Request, res: Response): Promise<void> => {
  try {
    const video = await MusicVideo.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!video) { res.status(404).json({ success: false, message: "Video not found" }); return; }
    res.json({ success: true, data: video });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

export const deleteVideo = async (req: Request, res: Response): Promise<void> => {
  try {
    const video = await MusicVideo.findByIdAndDelete(req.params.id);
    if (!video) { res.status(404).json({ success: false, message: "Video not found" }); return; }
    res.json({ success: true, message: "Video deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

export const getAudioTracks = async (_req: Request, res: Response): Promise<void> => {
  try {
    const tracks = await AudioTrack.find().sort({ order: 1, createdAt: -1 });
    res.json({ success: true, data: tracks });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

export const uploadAudioTrack = async (req: Request, res: Response): Promise<void> => {
  try {
    const file = req.file as Express.MulterS3.File;
    if (!file) {
      res.status(400).json({ success: false, message: "No file uploaded" });
      return;
    }

    const { title, description, duration, order } = req.body;
    if (!title) {
      res.status(400).json({ success: false, message: "Title is required" });
      return;
    }

    const track = await AudioTrack.create({
      title,
      description: description || "",
      key: file.key,
      url: file.location,
      duration: duration || "",
      order: order ? parseInt(order) : 0,
    });

    res.status(201).json({ success: true, data: track });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

export const deleteAudioTrack = async (req: Request, res: Response): Promise<void> => {
  try {
    const track = await AudioTrack.findById(req.params.id);
    if (!track) { res.status(404).json({ success: false, message: "Track not found" }); return; }
    await s3.send(new DeleteObjectCommand({ Bucket: S3_BUCKET(), Key: track.key }));
    await track.deleteOne();
    res.json({ success: true, message: "Track deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};