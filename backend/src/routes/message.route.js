import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getMessages, getUsersForSidebar, sendMessage, addReaction, getReactions } from "../controllers/message.controller.js";

const router = express.Router();

router.get("/users", protectRoute, getUsersForSidebar);
router.get("/:id", protectRoute, getMessages);

router.post("/send/:id", protectRoute, sendMessage);

// New routes for reactions
router.post("/reaction", protectRoute, addReaction);
router.get("/reaction/:messageId", protectRoute, getReactions);

export default router;
