import mongoose, { Document, Schema } from "mongoose";

export type NoteCategory =
  | "chemistry"
  | "cat_prep"
  | "gate_prep"
  | "tech"
  | "quizzing"
  | "life"
  | "sports"
  | "other";

export interface INote extends Document {
  title: string;
  content: string; // markdown supported
  category: NoteCategory;
  tags: string[];
  published: boolean;
  coverImageUrl?: string;
  coverImageKey?: string;
  readTimeMinutes: number;
  createdAt: Date;
  updatedAt: Date;
}

const NoteSchema = new Schema<INote>(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    category: {
      type: String,
      enum: ["chemistry", "cat_prep", "gate_prep", "tech", "quizzing", "life", "sports", "other"],
      default: "other",
    },
    tags: [{ type: String }],
    published: { type: Boolean, default: false },
    coverImageUrl: { type: String, default: "" },
    coverImageKey: { type: String, default: "" },
    readTimeMinutes: { type: Number, default: 1 },
  },
  { timestamps: true }
);

export const Note = mongoose.model<INote>("Note", NoteSchema);
