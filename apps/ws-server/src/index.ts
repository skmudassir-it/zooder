import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";
import Redis from "ioredis";
import cors from "cors";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config({ path: "../web/.env" });

const app = express();
app.use(cors());
app.use(express.json());

const httpServer = createServer(app);

const pubClient = new Redis(process.env.REDIS_URL || "redis://localhost:6379");
const subClient = pubClient.duplicate();

const io = new Server(httpServer, {
  adapter: createAdapter(pubClient, subClient),
  cors: {
    origin: process.env.NEXTAUTH_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const AUTH_SECRET = process.env.AUTH_SECRET || "change-me";

// Auth middleware
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error("Authentication required"));
    }
    const payload = jwt.verify(token, AUTH_SECRET) as { sub: string };
    socket.data.userId = payload.sub;
    next();
  } catch (err) {
    next(new Error("Invalid token"));
  }
});

io.on("connection", (socket) => {
  const userId = socket.data.userId;
  console.log(`User connected: ${userId}`);

  // Join personal rooms
  socket.join(`feed:${userId}`);
  socket.join(`notifications:${userId}`);

  // Handle post creation (from API webhook)
  socket.on("post:create", (data) => {
    // Broadcast to followers' feeds
    io.to(`feed:${userId}`).emit("feed:new_post", data);
  });

  // Join a post room for real-time comments
  socket.on("room:join", (postId: string) => {
    socket.join(`post:${postId}`);
  });

  socket.on("room:leave", (postId: string) => {
    socket.leave(`post:${postId}`);
  });

  // Typing indicator
  socket.on("typing:start", (postId: string) => {
    socket.to(`post:${postId}`).emit("typing:indicator", {
      userId,
      postId,
    });
  });

  // Comment added
  socket.on("comment:add", (data: { postId: string; comment: any }) => {
    io.to(`post:${data.postId}`).emit("comment:new", data.comment);
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${userId}`);
  });
});

// Health check
app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: Date.now() });
});

const PORT = parseInt(process.env.PORT || "3001");
httpServer.listen(PORT, () => {
  console.log(`WebSocket server running on port ${PORT}`);
});
