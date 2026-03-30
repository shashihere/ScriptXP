const mongoose = require('mongoose');

const testCaseSchema = new mongoose.Schema({
  input: { type: String, required: true },
  expectedOutput: { type: String, required: true },
  isHidden: { type: Boolean, default: false }
});

const problemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  topic: { type: mongoose.Schema.Types.ObjectId, ref: 'Topic' },
  difficulty: { type: Number, required: true, min: 1, max: 5 },
  xpReward: { type: Number, required: true },
  testCases: [testCaseSchema],
  hints: [{ type: String }],
  starterCode: {
    c: { type: String },
    cpp: { type: String },
    java: { type: String },
    python: { type: String },
    javascript: { type: String }
  },
  constraints: { type: String },
  tags: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model('Problem', problemSchema);
