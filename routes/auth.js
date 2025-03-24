const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const authMiddleware = require("../middleware/auth");

// CORS Preflight Handling - सभी methods के लिए
router.options("*", (req, res) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:5173");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, Origin");
  res.header("Access-Control-Allow-Credentials", "true");
  res.sendStatus(204);
});

// Get Current User
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ user });
  } catch (error) {
    console.error("Get User Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Signup - सुरक्षा सुधार के साथ
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // वैलिडेशन
    const errors = [];
    if (!name) errors.push("Name is required");
    if (!email) errors.push("Email is required");
    if (!password) errors.push("Password is required");
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) errors.push("Invalid email format");
    
    if (password && password.length < 6) {
      errors.push("Password must be at least 6 characters");
    }

    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    // यूजर अस्तित्व चेक (race condition से बचने के लिए)
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    // हैशिंग और यूजर क्रिएशन
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword
    });

    // टोकन जनरेशन
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT secret not configured");
    }
    
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" } // लॉन्गर एक्सपायरी
    );

    // रिस्पॉन्स
    res.status(201).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      },
      token
    });

  } catch (error) {
    console.error("Signup Error:", error);
    const statusCode = error.code === 11000 ? 409 : 500; // MongoDB duplicate key error
    res.status(statusCode).json({
      success: false,
      message: error.message || "Registration failed"
    });
  }
});

// Login - सुरक्षा सुधार के साथ
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // बेसिक वैलिडेशन
    if (!email || !password) {
      return res.status(400).json({ 
        success: false,
        message: "Email and password are required"
      });
    }

    // यूजर खोजें (case-insensitive)
    const user = await User.findOne({ 
      email: email.toLowerCase().trim() 
    }).select("+password");

    // सुरक्षा के लिए जेनरिक मैसेज
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    // टोकन जनरेशन
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // रिस्पॉन्स
    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      },
      token
    });

  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({
      success: false,
      message: "Authentication failed"
    });
  }
});

module.exports = router;