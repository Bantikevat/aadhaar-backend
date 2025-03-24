const express = require('express');
const router = express.Router();
const Reminder = require('../models/Reminder');
const authMiddleware = require('../middleware/auth');

// Create Reminder
router.post('/', authMiddleware, async (req, res) => {
  try {
    const reminder = await Reminder.create({
      userId: req.userId,
      ...req.body
    });
    res.status(201).json(reminder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get User Reminders
router.get('/', authMiddleware, async (req, res) => {
  try {
    const reminders = await Reminder.find({ userId: req.userId });
    res.json(reminders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch reminders' });
  }
});

module.exports = router;