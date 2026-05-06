import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { app, server } from "./lib/socket.js";

// 🔥 Load env FIRST
dotenv.config();

// 🔥 Safe PORT fallback
const PORT = process.env.PORT || 5000;

// 🔥 Fix __dirname for ES modules
const __dirname = path.resolve();

// ================= MIDDLEWARES =================
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// ================= ROUTES =================
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// ================= STATIC FILES =================

// 🔥 FIX: avoid undefined crash
const profilePicsDir = process.env.PROFILE_PICS_DIR
  ? path.join(__dirname, process.env.PROFILE_PICS_DIR)
  : path.join(__dirname, "uploads/profilePics");

// ensure static works
app.use("/profilepics", express.static(profilePicsDir));

// ================= FRONTEND SERVE =================
if (process.env.NODE_ENV === "production") {
  const frontendPath = path.join(__dirname, "../frontend/dist");

  app.use(express.static(frontendPath));

  app.get("*", (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
  });
}

// ================= START SERVER =================
connectDB()
  .then(() => {
    server.listen(PORT, () => {
      console.log(` Server running on PORT: ${PORT}`);
    });
  })
  .catch((err) => {
    console.error(" DB connection failed:", err);
    process.exit(1);
  });