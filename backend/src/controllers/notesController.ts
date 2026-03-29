import { Request, Response } from "express";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { Note } from "../models/Note";
import { s3, S3_BUCKET } from "../config/s3";

// Public — only published notes
export const getNotes = async (_req: Request, res: Response): Promise<void> => {
  try {
    const notes = await Note.find({ published: true }).sort({ createdAt: -1 });
    res.json({ success: true, data: notes });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

// Admin — all notes including drafts
export const getAllNotes = async (_req: Request, res: Response): Promise<void> => {
  try {
    const notes = await Note.find().sort({ createdAt: -1 });
    res.json({ success: true, data: notes });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

// Public — single note by ID
export const getNoteById = async (req: Request, res: Response): Promise<void> => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note || !note.published) {
      res.status(404).json({ success: false, message: "Note not found" });
      return;
    }
    res.json({ success: true, data: note });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

// Admin — create note
export const createNote = async (req: Request, res: Response): Promise<void> => {
  try {
    const file = req.file as Express.MulterS3.File | undefined;
    const tags = req.body.tags ? JSON.parse(req.body.tags) : [];

    const note = await Note.create({
      title: req.body.title,
      content: req.body.content,
      category: req.body.category || "other",
      tags,
      published: req.body.published === "true",
      coverImageUrl: file?.location || "",
      coverImageKey: file?.key || "",
    });

    res.status(201).json({ success: true, data: note });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

// Admin — update note
export const updateNote = async (req: Request, res: Response): Promise<void> => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      res.status(404).json({ success: false, message: "Note not found" });
      return;
    }

    const file = req.file as Express.MulterS3.File | undefined;
    const tags = req.body.tags ? JSON.parse(req.body.tags) : note.tags;

    // If new cover image uploaded, delete old one from S3
    if (file && note.coverImageKey) {
      try {
        await s3.send(new DeleteObjectCommand({ Bucket: S3_BUCKET(), Key: note.coverImageKey }));
      } catch { /* ignore S3 delete errors */ }
    }

    note.title = req.body.title || note.title;
    note.content = req.body.content || note.content;
    note.category = req.body.category || note.category;
    note.tags = tags;
    note.published = req.body.published !== undefined ? req.body.published === "true" : note.published;
    if (file) {
      note.coverImageUrl = file.location;
      note.coverImageKey = file.key;
    }

    await note.save();
    res.json({ success: true, data: note });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

// Admin — delete note
export const deleteNote = async (req: Request, res: Response): Promise<void> => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      res.status(404).json({ success: false, message: "Note not found" });
      return;
    }

    // Delete cover image from S3 if exists
    if (note.coverImageKey) {
      try {
        await s3.send(new DeleteObjectCommand({ Bucket: S3_BUCKET(), Key: note.coverImageKey }));
      } catch { /* ignore */ }
    }

    await note.deleteOne();
    res.json({ success: true, message: "Note deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};