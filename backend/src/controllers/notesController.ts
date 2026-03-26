import { Request, Response } from "express";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { Note } from "../models/Note";
import { s3, S3_BUCKET } from "../config/s3";

export const getNotes = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category } = req.query;
    const filter: Record<string, unknown> = { published: true };
    if (category) filter.category = category;
    const notes = await Note.find(filter).sort({ createdAt: -1 }).select("-content");
    res.json({ success: true, data: notes });
  } catch (error) { res.status(500).json({ success: false, message: "Server error", error }); }
};

export const getAllNotes = async (_req: Request, res: Response): Promise<void> => {
  try {
    const notes = await Note.find().sort({ createdAt: -1 }).select("-content");
    res.json({ success: true, data: notes });
  } catch (error) { res.status(500).json({ success: false, message: "Server error", error }); }
};

export const getNoteById = async (req: Request, res: Response): Promise<void> => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) { res.status(404).json({ success: false, message: "Note not found" }); return; }
    res.json({ success: true, data: note });
  } catch (error) { res.status(500).json({ success: false, message: "Server error", error }); }
};

export const createNote = async (req: Request, res: Response): Promise<void> => {
  try {
    const file = req.file as Express.MulterS3.File | undefined;
    const wordCount = req.body.content?.split(/\s+/).length || 0;
    const noteData = {
      ...req.body,
      tags: req.body.tags ? JSON.parse(req.body.tags) : [],
      readTimeMinutes: Math.max(1, Math.ceil(wordCount / 200)),
      coverImageUrl: file?.location || "",
      coverImageKey: file?.key || "",
    };
    const note = await Note.create(noteData);
    res.status(201).json({ success: true, data: note });
  } catch (error) { res.status(500).json({ success: false, message: "Server error", error }); }
};

export const updateNote = async (req: Request, res: Response): Promise<void> => {
  try {
    const file = req.file as Express.MulterS3.File | undefined;
    const updateData: Record<string, unknown> = { ...req.body };
    if (req.body.tags) updateData.tags = JSON.parse(req.body.tags);
    if (req.body.content) updateData.readTimeMinutes = Math.max(1, Math.ceil(req.body.content.split(/\s+/).length / 200));
    if (file) { updateData.coverImageUrl = file.location; updateData.coverImageKey = file.key; }
    const note = await Note.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!note) { res.status(404).json({ success: false, message: "Note not found" }); return; }
    res.json({ success: true, data: note });
  } catch (error) { res.status(500).json({ success: false, message: "Server error", error }); }
};

export const deleteNote = async (req: Request, res: Response): Promise<void> => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) { res.status(404).json({ success: false, message: "Note not found" }); return; }
    if (note.coverImageKey) {
      await s3.send(new DeleteObjectCommand({ Bucket: S3_BUCKET(), Key: note.coverImageKey }));
    }
    await note.deleteOne();
    res.json({ success: true, message: "Note deleted" });
  } catch (error) { res.status(500).json({ success: false, message: "Server error", error }); }
};
