const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Register User
const registerUser = async (req, res) => {
  const { username, email, password, userType } = req.body;
  try {
    const existing = await User.findOne({ email });
    if (existing) {
      return res.json({ status: "FAILURE", message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword, userType });
    await user.save();

    res.json({ status: "SUCCESS", message: "Registration successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "FAILURE", message: "Server error" });
  }
};

// Login User
const loginUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ status: "FAILURE", message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ status: "FAILURE", message: "Incorrect password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({
      status: "SUCCESS",
      message: "Login successful",
      data: {
        token,
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
          userType: user.userType
        }
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "FAILURE", message: "Server error" });
  }
};

module.exports = { registerUser, loginUser };
