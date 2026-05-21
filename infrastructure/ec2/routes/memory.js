const express = require('express');
const router = express.Router();
const claude = require('../services/claudeService');

router.post('/consolidation-tip', async (req, res, next) => {
  try {
    const { sleepDuration, sleepScore } = req.body;
    if (sleepDuration === undefined || sleepScore === undefined) {
      return res.status(400).json({ error: 'sleepDuration and sleepScore are required' });
    }
    const result = await claude.generateMemoryConsolidationTip(sleepDuration, sleepScore);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
