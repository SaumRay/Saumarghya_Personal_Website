import { Request, Response } from "express";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { Project } from "../models/Project";
import { s3, S3_BUCKET } from "../config/s3";

export const getProjects = async (_req: Request, res: Response): Promise<void> => {
  try {
    const projects = await Project.find().sort({ order: 1, createdAt: -1 });
    res.json({ success: true, data: projects });
  } catch (error) { res.status(500).json({ success: false, message: "Server error", error }); }
};

export const getFeaturedProjects = async (_req: Request, res: Response): Promise<void> => {
  try {
    const projects = await Project.find({ featured: true }).sort({ order: 1 });
    res.json({ success: true, data: projects });
  } catch (error) { res.status(500).json({ success: false, message: "Server error", error }); }
};

export const getProjectById = async (req: Request, res: Response): Promise<void> => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) { res.status(404).json({ success: false, message: "Project not found" }); return; }
    res.json({ success: true, data: project });
  } catch (error) { res.status(500).json({ success: false, message: "Server error", error }); }
};

export const createProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const file = req.file as Express.MulterS3.File | undefined;
    const projectData = {
      ...req.body,
      techStack: req.body.techStack ? JSON.parse(req.body.techStack) : [],
      imageKey: file?.key || "",
      imageUrl: file?.location || "",
    };
    const project = await Project.create(projectData);
    res.status(201).json({ success: true, data: project });
  } catch (error) { res.status(500).json({ success: false, message: "Server error", error }); }
};

export const updateProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const file = req.file as Express.MulterS3.File | undefined;
    const updateData: Record<string, unknown> = { ...req.body };
    if (req.body.techStack) updateData.techStack = JSON.parse(req.body.techStack);
    if (file) { updateData.imageKey = file.key; updateData.imageUrl = file.location; }
    const project = await Project.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
    if (!project) { res.status(404).json({ success: false, message: "Project not found" }); return; }
    res.json({ success: true, data: project });
  } catch (error) { res.status(500).json({ success: false, message: "Server error", error }); }
};

export const deleteProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) { res.status(404).json({ success: false, message: "Project not found" }); return; }
    if (project.imageKey) {
      await s3.send(new DeleteObjectCommand({ Bucket: S3_BUCKET(), Key: project.imageKey }));
    }
    await project.deleteOne();
    res.json({ success: true, message: "Project deleted successfully" });
  } catch (error) { res.status(500).json({ success: false, message: "Server error", error }); }
};
