import mongoose, { Schema, Document } from "mongoose";

export interface IMusicVideo extends Document {
  title: string;
  description: string;
  instagramUrl: string;
  embedHtml?: string;
  order: number;
  createdAt: Date;
}

export interface IAudioTrack extends Document {
  title: string;
  description: string;
  key: string;
  url: string;
  duration?: string;
  order: number;
  createdAt: Date;
}

const MusicVideoSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, default: "" },
  instagramUrl: { type: String, required: true },
  embedHtml: { type: String, default: "" },
  order: { type: Number, default: 0 },
}, { timestamps: true });

const AudioTrackSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, default: "" },
  key: { type: String, required: true },
  url: { type: String, required: true },
  duration: { type: String, default: "" },
  order: { type: Number, default: 0 },
}, { timestamps: true });

export const MusicVideo = mongoose.model<IMusicVideo>("MusicVideo", MusicVideoSchema);
export const AudioTrack = mongoose.model<IAudioTrack>("AudioTrack", AudioTrackSchema);