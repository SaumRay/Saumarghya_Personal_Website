import mongoose, { Document, Schema } from "mongoose";

export type CategoryDetailType =
  | "traveller"
  | "fitness"
  | "professional"
  | "college"
  | "family"
  | "events"
  | "other";

export interface ICategoryStat {
  label: string;
  value: string;
  muscleGroup?: string;
}

export interface ICategoryDetail extends Document {
  category: CategoryDetailType;
  title: string;
  subtitle: string;
  description: string;
  stats: ICategoryStat[];
  createdAt: Date;
  updatedAt: Date;
}

const CategoryStatSchema = new Schema<ICategoryStat>(
  {
    label: { type: String, required: true, trim: true },
    value: { type: String, required: true, trim: true },
    muscleGroup: { type: String, default: "" },
  },
  { _id: false }
);

const CategoryDetailSchema = new Schema<ICategoryDetail>(
  {
    category: {
      type: String,
      enum: ["traveller", "fitness", "professional", "college", "family", "events", "other"],
      required: true,
      unique: true,
    },
    title: { type: String, default: "" },
    subtitle: { type: String, default: "" },
    description: { type: String, default: "" },
    stats: { type: [CategoryStatSchema], default: [] },
  },
  { timestamps: true }
);

export const CategoryDetail = mongoose.model<ICategoryDetail>("CategoryDetail", CategoryDetailSchema);
