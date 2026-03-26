const express = require('express');
const router = express.Router();
const problemController = require('../controllers/problemController');
const { protect } = require('../middleware/auth');

router.get('/', problemController.getProblems);
router.get('/:id', problemController.getProblemById);
router.post('/:id/submit', protect, problemController.submitSolution);

module.exports = router;
