import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;

    // ❌ check missing URI
    if (!uri) {
      throw new Error("MONGO_URI is not defined in .env ❌");
    }

    console.log("🔌 Connecting to MongoDB...");

    // ✅ better connection
    const conn = await mongoose.connect(uri, {
      dbName: "bondchat", // 👈 ensure correct DB
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

  } catch (error) {
    console.error("❌ MongoDB Connection Error:");
    console.error(error.message);
    process.exit(1);
  }
};