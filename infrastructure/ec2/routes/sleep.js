const express = require('express');
const router = express.Router();
const claude = require('../services/claudeService');

router.post('/plan', async (req, res, next) => {
  try {
    const { profile } = req.body;
    if (!profile) return res.status(400).json({ error: 'profile is required' });
    const plan = await claude.generateSleepPlan(profile);
    res.json({ plan });
  } catch (err) {
    next(err);
  }
});

router.post('/insight', async (req, res, next) => {
  try {
    const { record } = req.body;
    if (!record) return res.status(400).json({ error: 'record is required' });
    const insight = await claude.generateDailyInsight(record);
    res.json({ insight });
  } catch (err) {
    next(err);
  }
});

router.post('/adjust', async (req, res, next) => {
  try {
    const { summary } = req.body;
    if (!summary) return res.status(400).json({ error: 'summary is required' });
    const adjustments = await claude.adjustWeeklyPlan(summary);
    res.json({ adjustments });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
