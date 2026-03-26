const mongoose = require('mongoose');

const dailyChallengeSchema = new mongoose.Schema({
  problem: { type: mongoose.Schema.Types.ObjectId, ref: 'Problem', required: true },
  date: { type: Date, required: true, unique: true }
}, { timestamps: true });

module.exports = mongoose.model('DailyChallenge', dailyChallengeSchema);
