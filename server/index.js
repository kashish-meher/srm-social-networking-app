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
import postRoutes from './routes/postRoutes.js';
import conversationRoutes from "./routes/conversationRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '.env') });

const app = express();
const server = http.createServer(app);
app.use(cors());
app.use(express.json());

// Serve uploaded profile pics
// Serve profile pics (public/uploads)
//app.use('/uploads', express.static(join(__dirname, '..', 'public', 'uploads')));

// Serve post images (server/uploads)
app.use('/uploads', express.static(join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes); //added
app.use('/api/posts', postRoutes);
app.use("/api/conversations", conversationRoutes);
app.use("/api/messages", messageRoutes);

// SOCKET.IO
const io = new Server(server, {
  cors: { origin: "*" }
});


let users = {};

io.on("connection", (socket) => {
  socket.on("addUser", (userId) => {
    users[userId] = socket.id;
  });

  socket.on("sendMessage", ({ senderId, receiverId, text }) => {
    const receiverSocket = users[receiverId];

    if (receiverSocket) {
      io.to(receiverSocket).emit("getMessage", {
        senderId,
        text,
      });
    }
  });

  socket.on("disconnect", () => {
    for (let userId in users) {
      if (users[userId] === socket.id) {
        delete users[userId];
      }
    }
  });
});

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