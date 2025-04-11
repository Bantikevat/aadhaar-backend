const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
const app = express();

// Middleware


const corsOptions = {
    origin: ["http://localhost:3000", "https://bypassaadharuclid.com"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

// Connect to DB
connectDB();

// Routes
app.use("/admin/auth", require("./routes/auth"));

// Server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
