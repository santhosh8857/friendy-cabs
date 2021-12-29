const mongoose = require("mongoose");

const DriverSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  carNo: Number,
  carType: String,
  wallet: { type: Number, default: 50 },
  available: { type: Boolean, default: false },
  contact: { type: Number, required: true },
  rideHistory: {
    from: { type: String, default: null },
    to: { type: String, default: null },
    startTime: Date,
    endTime: Date,
    fare: Number,
    distance,
    rideStatus,
  },
});

const driver = mongoose.model("drivers", DriverSchema);

module.exports = driver;
