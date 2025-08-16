import mongoose from "mongoose";
import { DATABASE_URL } from "./env";

export async function connectDB() {
  if (!DATABASE_URL) {
    throw new Error("MONGODB_URI is not set in .env");
  }

  await mongoose.connect(DATABASE_URL);
  console.log("✅ MongoDB connected");

  mongoose.connection.on("error", (err) => {
    console.error("MongoDB connection error:", err);
  });

  // Graceful shutdown
  process.on("SIGINT", async () => {
    await mongoose.connection.close();
    console.log("MongoDB disconnected on app termination");
    process.exit(0);
  });
}
