import { Request, Response } from "express";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { Gallery, GalleryCategory } from "../models/Gallery";
import { s3, S3_BUCKET } from "../config/s3";

export const getGalleries = async (_req: Request, res: Response): Promise<void> => {
  try {
    const galleries = await Gallery.find().sort({ order: 1, createdAt: -1 });
    res.json({ success: true, data: galleries });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

export const getGalleryById = async (req: Request, res: Response): Promise<void> => {
  try {
    const gallery = await Gallery.findById(req.params.id);
    if (!gallery) { res.status(404).json({ success: false, message: "Gallery not found" }); return; }
    res.json({ success: true, data: gallery });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

export const getGalleryByCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const category = req.params.category as GalleryCategory;

    if (!["traveller", "fitness", "professional", "college", "family", "events", "other"].includes(category)) {
      res.status(400).json({ success: false, message: "Invalid category" });
      return;
    }

    const galleries = await Gallery.find({ category }).sort({ order: 1, createdAt: -1 });
    res.json({ success: true, data: galleries });
  } catch (error) {
    console.error("GET CATEGORY ERROR:", error);
    res.status(500).json({ success: false, message: "Server error", error });
  }
};


export const createGallery = async (req: Request, res: Response): Promise<void> => {
  try {
    const gallery = await Gallery.create(req.body);
    res.status(201).json({ success: true, data: gallery });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

export const updateGallery = async (req: Request, res: Response): Promise<void> => {
  try {
    const gallery = await Gallery.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!gallery) { res.status(404).json({ success: false, message: "Gallery not found" }); return; }
    res.json({ success: true, data: gallery });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

export const uploadGalleryImages = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log("uploadGalleryImages controller hit");
    console.log("files:", req.files);

    const files = req.files as Express.MulterS3.File[];
    if (!files || files.length === 0) {
      res.status(400).json({ success: false, message: "No files uploaded" });
      return;
    }

    const captions: string[] = req.body.captions ? JSON.parse(req.body.captions) : files.map(() => "");
    const newImages = files.map((file, i) => ({
      key: file.key,
      url: file.location,
      caption: captions[i] || "",
      uploadedAt: new Date(),
    }));

    const gallery = await Gallery.findByIdAndUpdate(
      req.params.id,
      { $push: { images: { $each: newImages } } },
      { new: true }
    );

    if (!gallery) {
      res.status(404).json({ success: false, message: "Gallery not found" });
      return;
    }

    res.status(201).json({ success: true, data: newImages, gallery });
  } catch (error) {
    console.error("uploadGalleryImages error:", error);
    res.status(500).json({ success: false, message: "Server error", error });
  }
};


export const deleteGalleryImage = async (req: Request, res: Response): Promise<void> => {
  try {
    const key = decodeURIComponent(req.params.key);
    await s3.send(new DeleteObjectCommand({ Bucket: S3_BUCKET(), Key: key }));
    const gallery = await Gallery.findByIdAndUpdate(req.params.id, { $pull: { images: { key } } }, { new: true });
    res.json({ success: true, message: "Image deleted", gallery });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

export const deleteGallery = async (req: Request, res: Response): Promise<void> => {
  try {
    const gallery = await Gallery.findById(req.params.id);
    if (!gallery) { res.status(404).json({ success: false, message: "Gallery not found" }); return; }
    for (const img of gallery.images) {
      await s3.send(new DeleteObjectCommand({ Bucket: S3_BUCKET(), Key: img.key }));
    }
    await gallery.deleteOne();
    res.json({ success: true, message: "Gallery deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};
