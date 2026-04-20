import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';
import User from '../models/User.js';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Make sure uploads folder exists
const uploadsDir = join(__dirname, '..', '..', 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `profile_${Date.now()}${ext}`);
  },
});
const upload = multer({ storage });

// GET user profile
router.get('/profile/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update settings
router.put('/settings/:id', async (req, res) => {
  try {
    const { location, website, bio, prefs, profilePic } = req.body;
    const updateData = { location, website, bio, prefs };
    if (profilePic !== undefined) updateData.profilePic = profilePic;

    const updated = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).select('-password');

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST upload profile pic
router.post('/upload-profile-pic/:id', upload.single('profilePic'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const profilePicUrl = `uploads/${req.file.filename}`;

    await User.findByIdAndUpdate(
      req.params.id,
      { profilePic: profilePicUrl },
      { new: true }
    );

    console.log('✅ Profile pic saved:', profilePicUrl);
    res.json({ profilePicUrl });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: err.message });
  }
});

export default router;