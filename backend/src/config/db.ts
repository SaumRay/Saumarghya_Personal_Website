import mongoose from "mongoose";

export const connectDB = async (): Promise<void> => {
  try {
    const uri = process.env.MONGODB_URI as string;
    if (!uri) throw new Error("MONGODB_URI is not defined in environment variables");

    await mongoose.connect(uri);
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
};
