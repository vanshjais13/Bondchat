import User from "../models/user.model.js";
import Message from "../models/message.model.js";

import { getReceiverSocketId, io } from "../lib/socket.js";

export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.error("Error in getUsersForSidebar: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessages controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let imageUrl;
    if (image) {
      // Upload base64 image to cloudinary
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    await newMessage.save();

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Add reaction to a message
export const addReaction = async (req, res) => {
  try {
    const { messageId, emoji } = req.body;
    const userId = req.user._id;

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    // Find reaction for the emoji
    const reaction = message.reactions.find(r => r.emoji === emoji);
    if (reaction) {
      // Check if user already reacted
      const userIndex = reaction.userIds.findIndex(id => id.toString() === userId.toString());
      if (userIndex === -1) {
        reaction.userIds.push(userId);
      } else {
        // Remove reaction if already reacted
        reaction.userIds.splice(userIndex, 1);
        if (reaction.userIds.length === 0) {
          // Remove reaction object if no users left
          message.reactions = message.reactions.filter(r => r.emoji !== emoji);
        }
      }
    } else {
      // Add new reaction
      message.reactions.push({ emoji, userIds: [userId] });
    }

    await message.save();

    // Emit socket event to receiver
    const receiverId = message.senderId.toString() === userId.toString() ? message.receiverId : message.senderId;
    const receiverSocketId = getReceiverSocketId(receiverId.toString());
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("reactionUpdated", { messageId, reactions: message.reactions });
    }

    return res.status(200).json({ message: "Reaction updated", reactions: message.reactions });
  } catch (error) {
    console.error("Error adding reaction:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Get reactions for a message
export const getReactions = async (req, res) => {
  try {
    const { messageId } = req.params;
    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }
    return res.status(200).json({ reactions: message.reactions });
  } catch (error) {
    console.error("Error getting reactions:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
