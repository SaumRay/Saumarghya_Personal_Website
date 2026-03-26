// ⚠️ MUST be the very first import — loads .env before anything else
import "./config/env";

import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import { connectDB } from "./config/db";

import profileRoutes from "./routes/profile";
import projectRoutes from "./routes/projects";
import contactRoutes from "./routes/contact";
import authRoutes from "./routes/auth";
import galleryRoutes from "./routes/gallery";
import notesRoutes from "./routes/notes";
import categoryDetailRoutes from "./routes/categoryDetails";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:5173", credentials: true }));

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
const contactLimiter = rateLimit({ windowMs: 60 * 60 * 1000, max: 5 });

app.use(limiter);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.get("/health", (_req, res) => {
  res.json({ success: true, message: "Portfolio API is running 🚀", timestamp: new Date() });
});

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/contact", contactLimiter, contactRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/notes", notesRoutes);
app.use("/api/category-details", categoryDetailRoutes);

app.use((_req, res) => res.status(404).json({ success: false, message: "Route not found" }));

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error("❌ Unhandled error:", err.message);
  res.status(500).json({ success: false, message: err.message || "Internal server error" });
});

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📦 Environment: ${process.env.NODE_ENV || "development"}`);
  });
});

export default app;
