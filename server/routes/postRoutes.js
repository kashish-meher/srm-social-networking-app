import express from "express";
import multer from "multer";
import Post from "../models/Post.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();


// ================= MULTER SETUP =================
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });


// ================= CREATE POST =================
router.post("/", authMiddleware, upload.array("images", 4), async (req, res) => {
  try {
    const { content, tags } = req.body;

    const imagePaths = req.files
      ? req.files.map((file) => file.path)
      : [];

    const newPost = await Post.create({
      content,
      tags: tags ? JSON.parse(tags) : [],

      // ✅ FIX: take from token
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


// ================= GET ALL POSTS =================
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json(err);
  }
});


// ================= GET MY POSTS =================
router.get("/my-posts", authMiddleware, async (req, res) => {
  try {
    const posts = await Post.find({ userId: req.user.id })
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// ================= LIKE / UNLIKE =================
router.post("/like/:id", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    const post = await Post.findById(req.params.id);

    const alreadyLiked = post.likedBy.some(
      (u) => u.toString() === userId
    );

    if (alreadyLiked) {
      post.likes -= 1;
      post.likedBy = post.likedBy.filter(
        (u) => u.toString() !== userId
      );
    } else {
      post.likes += 1;
      post.likedBy.push(userId);
    }

    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json(err);
  }
});


// ================= COMMENT =================
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
    res.json(post);
  } catch (err) {
    res.status(500).json(err);
  }
});


// ================= DELETE =================
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: "Post deleted" });
  } catch (err) {
    res.status(500).json(err);
  }
});


// ================= UPDATE POST =================
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { content, tags } = req.body;

    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      {
        content,
        tags
      },
      { new: true } // ✅ THIS IS CRITICAL
    );

    res.json(updatedPost); // ✅ RETURN UPDATED POST
  } catch (err) {
    console.error("UPDATE ERROR:", err);
    res.status(500).json({ error: "Update failed" });
  }
});

export default router;