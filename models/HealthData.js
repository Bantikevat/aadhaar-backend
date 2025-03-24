const mongoose = require("mongoose");

const healthDataSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  bloodPressure: {
    systolic: { type: Number, required: true },
    diastolic: { type: Number, required: true },
  },
  sugarLevel: { type: Number, required: true },
  medication: [{
    name: { type: String, required: true },
    time: { type: Date, required: true },
  }],
  createdAt: { type: Date, default: Date.now },
});

const HealthData = mongoose.model("HealthData", healthDataSchema);
module.exports = HealthData;