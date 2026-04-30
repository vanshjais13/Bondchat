import express from "express";
import {
  signup,
  login,
  logout,
  updateProfile,
  checkAuth,
  forgotPassword,
  resetPassword, // 🔥 ADD THIS
} from "../controllers/auth.controller.js";

import { protectRoute } from "../middleware/auth.middleware.js";
import upload from "../middleware/upload.middleware.js";

const router = express.Router();

// ================= AUTH =================
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

// ================= PASSWORD =================
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword); // 🔥 IMPORTANT

// ================= PROFILE =================
router.put(
  "/update-profile",
  protectRoute,
  upload.single("profilePic"),
  updateProfile
);

// ================= CHECK AUTH =================
router.get("/check", protectRoute, checkAuth);

export default router;