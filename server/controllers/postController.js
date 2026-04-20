import Post from "../models/Post.js";

// ✅ GET MY POSTS
export const getMyPosts = async (req, res) => {
  try {
    const posts = await Post.find({ userId: req.user.id })
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};