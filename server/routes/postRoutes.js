import express from "express";
import multer from "multer";
import Post from "../models/Post.js";

const router = express.Router();

// multer setup
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });


// ✅ CREATE POST (SAVES TO DB)
router.post("/", upload.array("images", 4), async (req, res) => {
  try {
    console.log("REQ BODY:", req.body);

    const { content, tags, userId, userName } = req.body;

    const imagePaths = req.files
      ? req.files.map((file) => file.path)
      : [];

    const newPost = await Post.create({
      content,
      tags: tags ? JSON.parse(tags) : [],
      userId: userId && userId !== "undefined" ? userId : null,
      userName: userName || "Unknown",
      images: imagePaths,
    });

    console.log("Saved to DB ");

    res.json(newPost);
  } catch (err) {
    console.error("ERROR:", err);
    res.status(500).json({ error: "Failed to save" });
  }
});


// ✅ GET POSTS
router.get("/", async (req, res) => {
  const posts = await Post.find().sort({ createdAt: -1 });

  console.log("DB POSTS COUNT:", posts.length);

  res.json(posts);
});

router.post("/like/:id", async (req, res) => {
  try {
    const { user } = req.body;

    const post = await Post.findById(req.params.id);

    const alreadyLiked = post.likedBy.includes(user);

    if (alreadyLiked) {
      post.likes -= 1;
      post.likedBy = post.likedBy.filter(u => u !== user);
    } else {
      post.likes += 1;
      post.likedBy.push(user);
    }

    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/comment/:id", async (req, res) => {
  try {
    const { user, text } = req.body;

    const post = await Post.findById(req.params.id);
    post.comments.push({ user, text });

    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json(err);
  }
});

export default router;