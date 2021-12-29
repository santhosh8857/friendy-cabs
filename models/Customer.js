const mongoose = require("mongoose");

// Schema for customers
const CustomerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      minlength: 8,
    },
    contact: {
      type: String,
      required: true,
    },
    wallet: {
      type: Number,
      default: 100,
    },
    role: {
      type: String,
      default: "Customer",
    },
    rideHistory: {
      type: Array,
      default: [],
    },
  },
  { collection: "customers" }
);

const customer = mongoose.model("", CustomerSchema);

module.exports = customer;
