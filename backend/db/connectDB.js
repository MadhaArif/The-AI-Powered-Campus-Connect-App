import mongoose from "mongoose";

const connectDB = async () => {
  try {
    if (mongoose.connection.readyState >= 1) {
      console.log("🟢 MongoDB already connected");
      return;
    }

    console.log("⏳ Connecting to MongoDB...");

    const uri = process.env.DATABASE_CONNECTION_URL;
    if (!uri || typeof uri !== "string" || !uri.trim()) {
      console.warn("⚠️ DATABASE_CONNECTION_URL missing. Skipping DB connection for now.");
      return;
    }

    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
    });

    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    console.warn("⚠️ Continuing without database connection (dev mode)");
  }
};

export default connectDB;
