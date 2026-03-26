const User = require('../models/User');

exports.getLeaderboard = async (req, res) => {
  try {
    const users = await User.find().sort({ xp: -1 }).limit(10).select('userId xp level title badges');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
