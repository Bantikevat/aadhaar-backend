const express = require("express");

const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db"); // ✅ Import MongoDB Connection
require('./utils/scheduler'); // स्केड्यूलर शुरू करें
dotenv.config();
const app = express();

// CORS Middleware Update
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'] // ✅ ये जोड़ें
}));

app.use(express.json());




// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/data", require("./routes/healthData"));
app.use('/api/reminders', require('./routes/reminders')); // ये लाइन मौजूद होनी चाहिए



const startServer = async () => {
  try {
    await connectDB();
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (error) {
    console.error("❌ Server startup failed:", error);
    process.exit(1);
  }
};

startServer();