import mongoose, { Schema, Document } from "mongoose";

export interface IFavouriteItem {
  name: string;
  description?: string;
  imageUrl?: string;
  rating?: string;
  isTop3: boolean;
  order: number;
  musicType?: "artist" | "song"; // only used for music-artists category
  artistName?: string;           // only used when musicType === "song"
}

export interface IFavouriteCategory extends Document {
  category: string;
  label: string;
  emoji: string;
  note: string;
  isDefault: boolean;
  items: IFavouriteItem[];
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const FavouriteItemSchema = new Schema<IFavouriteItem>(
  {
    name:        { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    imageUrl:    { type: String, default: "" },
    rating:      { type: String, default: "" },
    isTop3:      { type: Boolean, default: false },
    order:       { type: Number, default: 0 },
    musicType:   { type: String, enum: ["artist", "song"], default: undefined },
    artistName:  { type: String, default: "" },
  },
  { _id: false }
);

const FavouriteCategorySchema = new Schema<IFavouriteCategory>(
  {
    category:  { type: String, required: true, unique: true, trim: true },
    label:     { type: String, required: true, trim: true },
    emoji:     { type: String, default: "⭐" },
    note:      { type: String, default: "" },
    isDefault: { type: Boolean, default: false },
    items:     { type: [FavouriteItemSchema], default: [] },
    order:     { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const FavouriteCategory = mongoose.model<IFavouriteCategory>(
  "FavouriteCategory",
  FavouriteCategorySchema
);