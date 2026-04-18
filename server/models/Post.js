import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, 
  userName: String, // optional for quick display
  text: String,
  createdAt: { type: Date, default: Date.now }
});

const postSchema = new mongoose.Schema({
  content: String,
  tags: [String],

  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, 
  userName: String, // optional

  images: [String],

  likes: { type: Number, default: 0 },
  likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], 

  comments: [commentSchema],

  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Post", postSchema);