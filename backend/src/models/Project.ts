import mongoose, { Document, Schema } from "mongoose";

export interface IProject extends Document {
  title: string;
  description: string;
  techStack: string[];
  githubUrl: string;
  liveUrl?: string;
  imageKey?: string;
  imageUrl?: string;
  color: string;
  featured: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    techStack: [{ type: String }],
    githubUrl: { type: String, default: "" },
    liveUrl: { type: String, default: "" },
    imageKey: { type: String, default: "" },
    imageUrl: { type: String, default: "" },
    color: { type: String, default: "from-blue-500 to-cyan-500" },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Project = mongoose.model<IProject>("Project", ProjectSchema);
