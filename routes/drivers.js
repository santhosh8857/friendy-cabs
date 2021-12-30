const express = require("express");
const router = express.Router();
const env = require("dotenv").config();

const mongoose = require("mongoose");
const driver = require("../models/Driver");

const { pwdEncrypt, pwdCompare } = require("../library/auth");

// connection to db
mongoose.connect(process.env.dbUrl);

// to get driver details
router.get("/", async (req, res) => {
  try {
    const data = await driver.find();
    res.send({ message: "Success!", status: true, data: data });
  } catch (err) {
    console.log(err);
    res.send({ message: "Error in connection", status: false, error: err });
  }
});

// to create a new driver
router.post("/create-driver", async (req, res) => {
  try {
    // password encryption
    const hash = await pwdEncrypt(req.body.password);
    req.body.password = hash;

    const data = await driver.create(req.body);
    res.send({ message: "Account Created!", status: true, data: data });
  } catch (err) {
    console.log(err);
    res.send({ message: "Error", status: false, error: err });
  }
});

// driver login
router.post("/login", async (req, res) => {
  try {
    const user = await driver.findOne({ email: req.body.email });
    // console.log(user);
    if (user) {
      // password comparison
      const compare = await pwdCompare(req.body.password, user.password);

      if (compare) {
        res.send({ message: "Login Successfull!", status: true, data: user });
      } else {
        res.send({ message: "Invalid email or password!", status: false });
      }
    } else {
      res.send({ message: "User not available" });
    }
  } catch (err) {
    console.log(err);
    res.send({ message: "Error in connection", status: false, error: err });
  }
});

// ** Main logic ** //

// to get the list of available drivers
router.get("/available-drivers", async (req, res) => {
  try {
    const data = await driver.find({ available: true });
    if (data.length !== 0)
      res.send({ message: "Available Drivers", status: true, data: data });
    else res.send({ message: "No drivers available", status: false });
  } catch (err) {
    console.log(err);
    res.send({ message: "Error in connection!", status: false });
  }
});

module.exports = router;
