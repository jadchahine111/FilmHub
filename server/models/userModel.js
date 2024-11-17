const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String }, // Not required for OAuth
  googleId: { type: String }, // For OAuth
  watchlist: [{ type: Number }], // Changed to store tmdbId as Number
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
  phoneNumber: { type: String, trim: true },
  isVerified: { type: Boolean, default: false },
  verificationToken: { type: String },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
  bio: { type: String, trim: true },
  profilePicture: { type: String },
  notificationPreferences: {
    email: { type: Boolean, default: true },
    push: { type: Boolean, default: true }
  },
  lastLogin: { type: Date },
  refreshToken: { type: String }, // Added to store the refresh token
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});



module.exports = mongoose.model('User', userSchema);