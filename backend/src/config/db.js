import mongoose from "mongoose";
import { env } from "./env.js";
export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(env.MONGODB_URI);
    console.log(`\u2705 MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("\u274C MongoDB connection error:", error);
    process.exit(1);
  }
};
