import Conversation from "../models/Conversation.js";

export const createConversation = async (req, res) => {
  const { senderId, receiverId } = req.body;

  try {
    if (!senderId || !receiverId) {
      return res.status(400).json({ message: "Missing user IDs" });
    }

    // FIX: use $all so order doesn't matter
    let conv = await Conversation.findOne({
      members: { $all: [senderId, receiverId], $size: 2 }
    }).populate("members", "name email profilePic");

    if (conv) return res.status(200).json(conv);

    conv = await Conversation.create({ members: [senderId, receiverId] });
    const populated = await conv.populate("members", "name email profilePic");

    res.status(201).json(populated);
  } catch (err) {
    console.error("createConversation error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getUserConversations = async (req, res) => {
  try {
    const convs = await Conversation.find({
      members: { $in: [req.params.userId] }
    })
      .populate("members", "name email profilePic")
      .sort({ updatedAt: -1 });

    res.status(200).json(convs);
  } catch (err) {
    console.error("getUserConversations error:", err);
    res.status(500).json({ message: "Server error" });
  }
};