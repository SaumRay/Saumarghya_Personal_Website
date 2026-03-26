import mongoose, { Document, Schema } from "mongoose";

export interface IProfile extends Document {
  name: string;
  tagline: string;
  bio: string;
  email: string;
  phone: string[];
  location: string;
  linkedin: string;
  github: string;
  instagram: string;
  profileImages: {
    key: string;
    url: string;
    label: string; // e.g. "professional", "casual", "gym"
    uploadedAt: Date;
  }[];
  resumeUrl: string;
  updatedAt: Date;
}

const ProfileSchema = new Schema<IProfile>(
  {
    name: { type: String, required: true },
    tagline: { type: String, default: "" },
    bio: { type: String, default: "" },
    email: { type: String, required: true },
    phone: [{ type: String }],
    location: { type: String, default: "" },
    linkedin: { type: String, default: "" },
    github: { type: String, default: "" },
    instagram: { type: String, default: "" },
    profileImages: [
      {
        key: { type: String, required: true },
        url: { type: String, required: true },
        label: { type: String, default: "general" },
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
    resumeUrl: { type: String, default: "" },
  },
  { timestamps: true }
);

export const Profile = mongoose.model<IProfile>("Profile", ProfileSchema);
