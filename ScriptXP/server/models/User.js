const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
  name: { type: String, required: true },
  unlocked: { type: Boolean, default: false },
  progress: { type: Number, default: 0, min: 0, max: 100 },
});

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    userId: {
      type: String,
      required: [true, 'User ID (coder alias) is required'],
      unique: true,
      trim: true,
      minlength: [3, 'User ID must be at least 3 characters'],
      maxlength: [20, 'User ID cannot exceed 20 characters'],
      match: [/^[a-zA-Z0-9_]+$/, 'User ID can only contain letters, numbers, and underscores'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
    },
    xp: {
      type: Number,
      default: 100,
    },
    level: {
      type: Number,
      default: 1,
    },
    class: {
      type: String,
      enum: ['Novice', 'Data Structurer', 'Algorithmist', 'Dynamic Thinker', 'Graph Master', null],
      default: null,
    },
    skills: {
      type: [skillSchema],
      default: [],
    },
    badges: {
      type: [String],
      default: ['Early Adopter'],
    },
    title: {
      type: String,
      default: 'Novice Coder',
    },
    streak: {
      current: { type: Number, default: 0 },
      longest: { type: Number, default: 0 },
      lastActivity: { type: Date },
      freezesRemaining: { type: Number, default: 2 },
    },
    solvedProblems: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Problem' }],
    unlockedTopics: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Topic' }],
    hintsUsed: {
      free: { type: Number, default: 0 },
      paid: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('User', userSchema);
