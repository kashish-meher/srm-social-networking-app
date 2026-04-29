// routes/feedbackRoutes.js
import express from 'express';
import Feedback from '../models/Feedback.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { category, title, feedback, rating, anonymous } = req.body;

    if (!category || !title || !feedback || !rating) {
      return res.status(400).json({ message: 'All required fields must be filled.' });
    }

    let userId = null;
    const authHeader = req.headers.authorization;
    if (!anonymous && authHeader) {
      try {
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        userId = decoded.id;
      } catch (_) {}
    }

    const newFeedback = new Feedback({
      category, title, feedback, rating, anonymous,
      submittedBy: anonymous ? null : userId,
    });

    await newFeedback.save();
    res.status(201).json({ message: 'Feedback submitted successfully.' });
  } catch (err) {
    console.error('Feedback error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

router.get('/', async (req, res) => {
  try {
    const feedbacks = await Feedback.find()
      .populate('submittedBy', 'name email')
      .sort({ createdAt: -1 });
    res.json(feedbacks);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

export default router;