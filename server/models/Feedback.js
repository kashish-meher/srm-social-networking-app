// models/Feedback.js
import mongoose from 'mongoose';  // ✅ import not require

const feedbackSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      enum: ['bug', 'feature', 'ui', 'content', 'other'],
      required: true,
    },
    title: { type: String, required: true, trim: true, minlength: 5, maxlength: 80 },
    feedback: { type: String, required: true, trim: true, minlength: 20, maxlength: 500 },
    rating: { type: Number, required: true, min: 1, max: 5 },
    anonymous: { type: Boolean, default: false },
    submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  },
  { timestamps: true }
);

export default mongoose.model('Feedback', feedbackSchema);