import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import http from "http";
import { Server } from "socket.io";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import conversationRoutes from "./routes/conversationRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import feedbackRoutes from './routes/feedbackRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import createPostRouter from './routes/postRoutes.js';
import { initMessageController } from './controllers/messageController.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '.env') });

const app = express();
const server = http.createServer(app);

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use('/uploads', express.static(join(__dirname, 'uploads')));

// ✅ STEP 1 — Define io and users FIRST
const io = new Server(server, { cors: { origin: "*" } });
const users = {};

// ✅ STEP 2 — Inject io and users into controllers that need them
initMessageController(io, users);

// ✅ STEP 3 — Socket events
io.on("connection", (socket) => {
  socket.on("addUser", (userId) => {
    users[userId] = socket.id;
    console.log(`✅ User connected to socket: ${userId}`);
  });

  socket.on("sendMessage", ({ senderId, receiverId, text }) => {
    const receiverSocket = users[receiverId];
    if (receiverSocket) {
      io.to(receiverSocket).emit("getMessage", { senderId, text });
    }
  });

  socket.on("disconnect", () => {
    for (let userId in users) {
      if (users[userId] === socket.id) delete users[userId];
    }
  });
});

// ✅ STEP 4 — Routes (postRoutes gets io and users via factory)
app.use('/api/auth',          authRoutes);
app.use('/api/users',         userRoutes);
app.use("/api/conversations", conversationRoutes);
app.use("/api/messages",      messageRoutes);
app.use('/api/feedback',      feedbackRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/posts',         createPostRouter(io, users)); // ✅ factory

// ✅ STEP 5 — Connect DB and start server
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB Atlas connected successfully');
    server.listen(process.env.PORT || 5000, () =>
      console.log(`Server running on port ${process.env.PORT || 5000}`)
    );
  })
  .catch(err => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });