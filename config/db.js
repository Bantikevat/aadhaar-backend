const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const dtas = process.env.MONGO_URI ; // Fallback
    await mongoose.connect(dtas);
    console.log("✅ MongoDB Connected!");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;