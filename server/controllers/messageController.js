import Message from "../models/Message.js";

export const sendMessage = async (req, res) => {
  try {
    const newMsg = new Message(req.body);
    const saved = await newMsg.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("sendMessage error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const msgs = await Message.find({
      conversationId: req.params.conversationId,
    }).sort({ createdAt: 1 }); // FIX: ensure chronological order

    res.status(200).json(msgs);
  } catch (err) {
    console.error("getMessages error:", err);
    res.status(500).json({ message: "Server error" });
  }
};