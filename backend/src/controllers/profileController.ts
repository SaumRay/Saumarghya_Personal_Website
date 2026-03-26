import { Request, Response } from "express";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { Profile } from "../models/Profile";
import { s3, S3_BUCKET } from "../config/s3";

export const getProfile = async (_req: Request, res: Response): Promise<void> => {
  try {
    const profile = await Profile.findOne();
    if (!profile) { res.status(404).json({ success: false, message: "Profile not found" }); return; }
    res.json({ success: true, data: profile });
  } catch (error) { res.status(500).json({ success: false, message: "Server error", error }); }
};

export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const profile = await Profile.findOneAndUpdate({}, req.body, { new: true, upsert: true, runValidators: true });
    res.json({ success: true, data: profile });
  } catch (error) { res.status(500).json({ success: false, message: "Server error", error }); }
};

export const uploadProfileImage = async (req: Request, res: Response): Promise<void> => {
  try {
    const file = req.file as Express.MulterS3.File;
    if (!file) { res.status(400).json({ success: false, message: "No file uploaded" }); return; }
    const label = req.body.label || "general";
    const imageData = { key: file.key, url: file.location, label, uploadedAt: new Date() };
    const profile = await Profile.findOneAndUpdate({}, { $push: { profileImages: imageData } }, { new: true, upsert: true });
    res.status(201).json({ success: true, data: imageData, profile });
  } catch (error) { res.status(500).json({ success: false, message: "Server error", error }); }
};

export const deleteProfileImage = async (req: Request, res: Response): Promise<void> => {
  try {
    const key = decodeURIComponent(req.params.key);
    await s3.send(new DeleteObjectCommand({ Bucket: S3_BUCKET(), Key: key }));
    const profile = await Profile.findOneAndUpdate({}, { $pull: { profileImages: { key } } }, { new: true });
    res.json({ success: true, message: "Image deleted", profile });
  } catch (error) { res.status(500).json({ success: false, message: "Server error", error }); }
};
