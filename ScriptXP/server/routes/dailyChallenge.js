const express = require('express');
const router = express.Router();
const dailyChallengeController = require('../controllers/dailyChallengeController');

router.get('/', dailyChallengeController.getDailyChallenge);

module.exports = router;
