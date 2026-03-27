import mongoose, { Document, Schema } from "mongoose";

export interface IRPGStat {
  label: string;
  value: number;       // 0–100
  color: string;       // Tailwind bg class, e.g. "bg-cyan-400"
  trackColor: string;  // Tailwind bg class for empty blocks, e.g. "bg-cyan-950"
}

export interface IRPGBadge {
  label: string;
  borderColor: string; // Tailwind border class, e.g. "border-yellow-500"
  textColor: string;   // Tailwind text class, e.g. "text-yellow-400"
}

export interface IRPGCardConfig {
  title: string;       // e.g. "THE POLYMATH"
  subtitle: string;    // e.g. "Agartala → Coimbatore · XAT 98.79 · CAT 94.11"
  level: number;
  archetype: string;   // e.g. "POLYMATH"
  hp: number;
  cardNumber: string;
  stats: IRPGStat[];
  badges: IRPGBadge[];
}

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
    label: string;
    uploadedAt: Date;
  }[];
  resumeUrl: string;
  rpgCard?: IRPGCardConfig;
  updatedAt: Date;
}

const RPGStatSchema = new Schema<IRPGStat>(
  {
    label:      { type: String, required: true },
    value:      { type: Number, required: true, min: 0, max: 100 },
    color:      { type: String, default: "bg-cyan-400" },
    trackColor: { type: String, default: "bg-cyan-950" },
  },
  { _id: false }
);

const RPGBadgeSchema = new Schema<IRPGBadge>(
  {
    label:       { type: String, required: true },
    borderColor: { type: String, default: "border-yellow-500" },
    textColor:   { type: String, default: "text-yellow-400" },
  },
  { _id: false }
);

const RPGCardSchema = new Schema<IRPGCardConfig>(
  {
    title:      { type: String, default: "THE POLYMATH" },
    subtitle:   { type: String, default: "" },
    level:      { type: Number, default: 1 },
    archetype:  { type: String, default: "EXPLORER" },
    hp:         { type: Number, default: 99, min: 0, max: 999 },
    cardNumber: { type: String, default: "001" },
    stats:      { type: [RPGStatSchema],  default: [] },
    badges:     { type: [RPGBadgeSchema], default: [] },
  },
  { _id: false }
);

const ProfileSchema = new Schema<IProfile>(
  {
    name:     { type: String, required: true },
    tagline:  { type: String, default: "" },
    bio:      { type: String, default: "" },
    email:    { type: String, required: true },
    phone:    [{ type: String }],
    location: { type: String, default: "" },
    linkedin: { type: String, default: "" },
    github:   { type: String, default: "" },
    instagram:{ type: String, default: "" },
    profileImages: [
      {
        key:        { type: String, required: true },
        url:        { type: String, required: true },
        label:      { type: String, default: "general" },
        uploadedAt: { type: Date,   default: Date.now },
      },
    ],
    resumeUrl: { type: String, default: "" },
    rpgCard:   { type: RPGCardSchema, default: undefined },
  },
  { timestamps: true }
);

export const Profile = mongoose.model<IProfile>("Profile", ProfileSchema);