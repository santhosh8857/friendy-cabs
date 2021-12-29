const express = require("express");
const router = express.Router();
const env = require("dotenv").config();

const mongoose = require("mongoose");
const driver = require("../models/Driver");

mongoose.connect(process.env.dbUrl);

// to get driver detail
router.get("/", async (req, res) => {
  const data = await driver.find();
  driver.save();

  res.send({ message: "Success!", status: true, data: data });
});

router.post("/create-driver", async (req, res) => {
  const data = await driver.create(req.body);
});

module.exports = router;
