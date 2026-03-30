const DailyChallenge = require('../models/DailyChallenge');
const Problem = require('../models/Problem');

exports.getDailyChallenge = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let challenge = await DailyChallenge.findOne({ date: today }).populate('problem');
    
    if (!challenge) {
      const problems = await Problem.find();
      if (problems.length > 0) {
        const randomProblem = problems[Math.floor(Math.random() * problems.length)];
        challenge = new DailyChallenge({ problem: randomProblem._id, date: today });
        await challenge.save();
        challenge = await DailyChallenge.findById(challenge._id).populate('problem');
      } else {
        return res.status(404).json({ message: 'No challenges available' });
      }
    }

    res.json(challenge);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
