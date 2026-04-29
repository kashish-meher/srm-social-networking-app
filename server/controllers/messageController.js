import Message from "../models/Message.js";
import { createNotification } from '../utils/notificationHelper.js';

// ✅ io and users passed in from index.js via factory
let _io, _users;
export function initMessageController(io, users) {
  _io = io;
  _users = users;
}

export const sendMessage = async (req, res) => {
  try {
    const newMsg = new Message(req.body);
    const saved = await newMsg.save();

    // ✅ Notify receiver — inside the function, using saved message data
    const receiverId = req.body.receiverId; // make sure frontend sends this
    const senderId   = req.body.sender;

    if (receiverId && senderId && receiverId !== senderId) {
      await createNotification({
        io: _io,
        getUsers: () => _users,
        recipient: receiverId,
        sender: senderId,
        type: 'message',
      });
    }

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
    }).sort({ createdAt: 1 });

    res.status(200).json(msgs);
  } catch (err) {
    console.error("getMessages error:", err);
    res.status(500).json({ message: "Server error" });
  }
};