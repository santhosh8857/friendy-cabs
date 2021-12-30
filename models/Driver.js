const mongoose = require("mongoose");

// schema for drivers
const DriverSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
  },
  password: {
    type: String,
    minlength: 8,
  },
  carNo: {
    type: Number,
    default: null,
  },
  carType: {
    type: String,
    lowercase: true,
  },
  wallet: {
    type: Number,
    default: 50,
  },
  available: {
    type: Boolean,
    default: true,
  },
  contact: {
    type: Number,
    required: true,
  },
  role: {
    type: String,
    default: "Driver",
  },
  rideHistory: {
    type: Array,
    default: [],
  },
});

// driver model
const driver = mongoose.model("drivers", DriverSchema);

module.exports = driver;

// {
//   from: { type: String, default: null },
//   to: { type: String, default: null },
//   startTime: {Date},
//   endTime: Date,
//   fare: Number,
//   distance: Number,
//   rideStatus: String,
// },

// {
//   from: String,
//   to: String,
//   startDate: { type: Date, default: Date.now() },
//   endDate: Date,
//   distance: Number,
//   fare: Number,
//   rideStatus: { type: String, default: "awaiting driver response" },
//   customerId: String,
// },
