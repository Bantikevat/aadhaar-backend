const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

// Load environment variables from .env file
dotenv.config();

// Initialize Express App
const app = express();

// Ensure that MONGO_URI is defined before connecting
if (!process.env.MONGO_URI) {
    console.error("❌ MongoDB URI is missing. Please check your .env file.");
    process.exit(1);
}

// CORS Configuration
app.use(cors({
  origin: process.env.VITE_API_URL || 'http://localhost:5173',  // Use VITE_API_URL if available
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware to parse JSON request bodies
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/data", require("./routes/healthData"));
app.use("/api/reminders", require("./routes/reminders"));
app.get("/", (req, res) => {
  res.send("Backend is running successfully! 🚀");
});

// Start Server Function
const startServer = async () => {
  try {
    await connectDB(); // Ensure MongoDB is connected before starting the server
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  } catch (error) {
    console.error("❌ Server startup failed:", error);
    process.exit(1);
  }
};


// Start the Server
startServer();
