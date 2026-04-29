import express from "express";
import multer from "multer";
import Post from "../models/Post.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { createNotification } from '../utils/notificationHelper.js';

// ✅ NO import of io/users from index.js — received as parameters instead

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// ✅ Factory function — io and users passed in from index.js
export default function createPostRouter(io, users) {
  const router = express.Router();

  router.post("/", authMiddleware, upload.array("images", 4), async (req, res) => {
    try {
      const { content, tags } = req.body;
      const imagePaths = req.files ? req.files.map((file) => file.path) : [];
      const newPost = await Post.create({
        content,
        tags: tags ? JSON.parse(tags) : [],
        userId: req.user.id,
        userName: req.user.name,
        images: imagePaths,
      });
      res.json(newPost);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  });

  router.get("/", async (req, res) => {
    try {
      const posts = await Post.find().sort({ createdAt: -1 });
      res.json(posts);
    } catch (err) {
      res.status(500).json(err);
    }
  });

  router.get("/my-posts", authMiddleware, async (req, res) => {
    try {
      const posts = await Post.find({ userId: req.user.id }).sort({ createdAt: -1 });
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  router.post("/like/:id", authMiddleware, async (req, res) => {
    try {
      const userId = req.user.id;
      const post = await Post.findById(req.params.id);
      const alreadyLiked = post.likedBy.some((u) => u.toString() === userId);

      if (alreadyLiked) {
        post.likes -= 1;
        post.likedBy = post.likedBy.filter((u) => u.toString() !== userId);
      } else {
        post.likes += 1;
        post.likedBy.push(userId);
      }

      await post.save();

      if (!alreadyLiked) {
        await createNotification({
          io, 
          getUsers: () => users,
          recipient: post.userId,
          sender: userId,
          type: 'like',
          postId: post._id,
        });
      }

      res.json(post);
    } catch (err) {
      res.status(500).json(err);
    }
  });

  router.post("/comment/:id", authMiddleware, async (req, res) => {
    try {
      const { text } = req.body;
      const post = await Post.findById(req.params.id);

      post.comments.push({
        userId: req.user.id,
        userName: req.user.name,
        text,
      });

      await post.save();

      await createNotification({
        io, 
        getUsers: () => users,
        recipient: post.userId,
        sender: req.user.id,
        type: 'comment',
        postId: post._id,
      });

      res.json(post);
    } catch (err) {
      res.status(500).json(err);
    }
  });

  router.delete("/:id", authMiddleware, async (req, res) => {
    try {
      await Post.findByIdAndDelete(req.params.id);
      res.json({ message: "Post deleted" });
    } catch (err) {
      res.status(500).json(err);
    }
  });

  router.put("/:id", authMiddleware, async (req, res) => {
    try {
      const { content, tags } = req.body;
      const updatedPost = await Post.findByIdAndUpdate(
        req.params.id,
        { content, tags },
        { new: true }
      );
      res.json(updatedPost);
    } catch (err) {
      console.error("UPDATE ERROR:", err);
      res.status(500).json({ error: "Update failed" });
    }
  });

  return router;
}