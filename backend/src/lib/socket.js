import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

// 🔥 store online users
const userSocketMap = {}; // { userId: socketId }

// socket setup
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

// 🔥 helper function
export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

// 🔥 connection
io.on("connection", (socket) => {
  console.log("⚡ User connected:", socket.id);

  const userId = socket.handshake.query.userId;

  // store userId inside socket (important for calls)
  socket.userId = userId;

  if (userId) {
    userSocketMap[userId] = socket.id;
  }

  // send all online users
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // ================================
  // 🔥 AUDIO / VIDEO CALL EVENTS
  // ================================

  // 📞 Call user
  socket.on("call-user", ({ to, offer }) => {
    const receiverSocketId = userSocketMap[to];

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("incoming-call", {
        from: socket.userId,
        offer,
      });
    }
  });

  // ✅ Answer call
  socket.on("answer-call", ({ to, answer }) => {
    const receiverSocketId = userSocketMap[to];

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("call-accepted", {
        answer,
      });
    }
  });

  // 🔁 ICE candidate exchange (WebRTC)
  socket.on("ice-candidate", ({ to, candidate }) => {
    const receiverSocketId = userSocketMap[to];

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("ice-candidate", candidate);
    }
  });

  // ❌ End call (optional but useful)
  socket.on("end-call", ({ to }) => {
    const receiverSocketId = userSocketMap[to];

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("call-ended");
    }
  });

  // ================================

  // disconnect
  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);

    if (userId && userSocketMap[userId]) {
      delete userSocketMap[userId];
    }

    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

// export
export { io, app, server };