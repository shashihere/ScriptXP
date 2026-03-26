const Problem = require('../models/Problem');
const Submission = require('../models/Submission');
const codeExecutor = require('../utils/codeExecutor');

exports.getProblems = async (req, res) => {
  try {
    const problems = await Problem.find().select('-testCases -starterCode');
    res.json(problems);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getProblemById = async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id);
    if (!problem) return res.status(404).json({ message: 'Problem not found' });
    res.json(problem);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.submitSolution = async (req, res) => {
  try {
    const { code, language } = req.body;
    const problem = await Problem.findById(req.params.id);
    if (!problem) return res.status(404).json({ message: 'Problem not found' });

    // evaluate code
    const result = await codeExecutor.evaluateCode(code, language, problem.testCases);

    const submission = new Submission({
      user: req.user.id, // Assuming req.user is set by auth middleware
      problem: problem._id,
      code,
      language,
      status: result.status,
      executionTime: result.time,
      memory: result.memory
    });
    await submission.save();

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error during execution' });
  }
};
