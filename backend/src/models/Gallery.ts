import mongoose, { Document, Schema } from "mongoose";

export type GalleryCategory =
  | "traveller"
  | "fitness"
  | "professional"
  | "college"
  | "family"
  | "friends" 
  | "events"
  | "other";

export interface IGalleryImage {
  key: string;
  url: string;
  caption: string;
  uploadedAt: Date;
}

export interface IGallery extends Document {
  category: GalleryCategory;
  label: string; // display name e.g. "Travel Adventures"
  description: string;
  coverImageUrl: string;
  images: IGalleryImage[];
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const GallerySchema = new Schema<IGallery>(
  {
    category: {
      type: String,
      enum: ["traveller", "fitness", "professional", "college", "family",  "friends", "events", "other"],
      required: true,
    },
    label: { type: String, required: true },
    description: { type: String, default: "" },
    coverImageUrl: { type: String, default: "" },
    images: [
      {
        key: { type: String, required: true },
        url: { type: String, required: true },
        caption: { type: String, default: "" },
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Gallery = mongoose.model<IGallery>("Gallery", GallerySchema);
