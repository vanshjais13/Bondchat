import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { sendEmail } from "../utils/email.js";
import crypto from "crypto";

// ================= SIGNUP =================
export const signup = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    console.log("BODY:", req.body); // debug

    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be 6+ characters" });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const userExists = await User.findOne({ email: normalizedEmail });
    if (userExists) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      fullName,
      email: normalizedEmail,
      password: hashedPassword,
    });

    await newUser.save();

    generateToken(newUser._id, res);

    res.status(201).json({
      _id: newUser._id,
      fullName: newUser.fullName,
      email: newUser.email,
    });

  } catch (error) {
    console.error("🔥 SIGNUP ERROR:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ================= FORGOT PASSWORD =================
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const cleanEmail = email.trim().toLowerCase();

    const user = await User.findOne({ email: cleanEmail });
    if (!user) return res.status(404).json({ message: "User not found" });

    const resetToken = crypto.randomBytes(32).toString("hex");

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 min

    await user.save();

    const resetLink = `${process.env.CLIENT_URL || "http://localhost:5173"}/reset-password/${resetToken}`;

    try {
      await sendEmail(
        user.email,
        "Reset Password",
        `<h3>Password Reset</h3>
         <p>Click below:</p>
         <a href="${resetLink}">${resetLink}</a>`
      );
    } catch (err) {
      console.log("Reset email failed:", err.message);
      return res.status(500).json({ message: "Email not sent" });
    }

    res.status(200).json({ message: "Reset link sent ✅" });

  } catch (error) {
    console.error("Forgot Error ❌:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ================= RESET PASSWORD =================
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ message: "Password required" });
    }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) return res.status(400).json({ message: "Invalid or expired token" });

    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.status(200).json({ message: "Password reset successful ✅" });

  } catch (error) {
    console.error("Reset Error ❌:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ================= UPDATE PROFILE =================
export const updateProfile = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    if (!req.file) {
      return res.status(400).json({ message: "Profile picture required" });
    }

    const profilePicUrl = `/profilepics/${req.file.filename}`;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { profilePic: profilePicUrl },
      { new: true }
    );

    res.status(200).json(updatedUser);

  } catch (error) {
    console.error("Update Error ❌:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ================= CHECK AUTH =================
export const checkAuth = (req, res) => {
  try {
    if (!req.user) return res.status(401).json(null);
    res.status(200).json(req.user);
  } catch (error) {
    console.error("CheckAuth Error ❌:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
// ================= LOGIN =================
export const login = async (req, res) => {
  try {
    let { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    email = email.trim().toLowerCase();

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    generateToken(user._id, res);

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic || "",
    });

  } catch (error) {
    console.error("Login Error ❌:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
// ================= LOGOUT =================
export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout Error ❌:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};