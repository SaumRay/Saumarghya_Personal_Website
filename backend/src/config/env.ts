import dotenv from "dotenv";
import path from "path";

// Load .env from project root — must run before ANY other imports
dotenv.config({ path: path.resolve(__dirname, "../../.env") });
