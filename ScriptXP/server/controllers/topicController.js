const Topic = require('../models/Topic');

exports.getTopics = async (req, res) => {
  try {
    const topics = await Topic.find().populate('prerequisites', 'name');
    res.json(topics);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
