import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePic: { type: String, default: '' },
  bio: { type: String, default: '' },
  location: { type: String, default: '' },
  website: { type: String, default: '' },
  prefs: {
    privateProfile: { type: Boolean, default: false },
    pushNotifications: { type: Boolean, default: true },
    showOnlineStatus: { type: Boolean, default: true },
  },
}, { timestamps: true });

export default mongoose.model('User', UserSchema);