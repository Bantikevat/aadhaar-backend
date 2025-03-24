const express = require("express");
const router = express.Router();
const HealthData = require("../models/HealthData");
const authMiddleware = require("../middleware/auth"); // आगे बनाएँगे

// Add Health Data (Protected Route)
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { bloodPressure, sugarLevel, medication } = req.body;
    const newData = new HealthData({
      userId: req.userId, // authMiddleware से आएगा
      bloodPressure,
      sugarLevel,
      medication,
    });
    await newData.save();
    res.status(201).json(newData);
  } catch (error) {
    res.status(500).json({ message: "डेटा सेव नहीं हुआ!" });
  }
});

// Get User's Health Data
router.get("/", authMiddleware, async (req, res) => {
  try {
    const data = await HealthData.find({ userId: req.userId });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "डेटा नहीं मिला!" });
  }
});

module.exports = router;