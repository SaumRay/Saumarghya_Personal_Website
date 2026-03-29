import mongoose, { Document, Schema } from "mongoose";

export interface IVisitor extends Document {
  name: string;
  visitCount: number;
  firstVisit: Date;
  lastVisit: Date;
  fingerprint: string; // browser fingerprint stored in localStorage
}

const VisitorSchema = new Schema<IVisitor>(
  {
    name:        { type: String, default: "Anonymous", trim: true },
    visitCount:  { type: Number, default: 1 },
    firstVisit:  { type: Date, default: Date.now },
    lastVisit:   { type: Date, default: Date.now },
    fingerprint: { type: String, required: true, unique: true, trim: true },
  },
  { timestamps: false }
);

export const Visitor = mongoose.model<IVisitor>("Visitor", VisitorSchema);