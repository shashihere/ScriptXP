const mongoose = require('mongoose');

const topicSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  order: { type: Number, required: true },
  prerequisites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Topic' }],
  problems: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Problem' }],
  requiredToUnlock: { type: Number, default: 0 },
  icon: { type: String },
  isStarterTopic: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Topic', topicSchema);
