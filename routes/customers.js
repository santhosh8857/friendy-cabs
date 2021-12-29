var express = require("express");
var router = express.Router();
const env = require("dotenv").config();

const mongoose = require("mongoose");
const customer = require("../models/Customer");

const { pwdEncrypt, pwdCompare } = require("../library/auth");

// connection to db
mongoose.connect(
  process.env.dbUrl,
  () => {
    console.log("Connected to DB");
  },
  (e) => {
    console.log("Error while connecting to DB", e);
  }
);

// to get customer details
router.get("/", async (req, res) => {
  try {
    const data = await customer.find();
    res.send({ message: "Success!", status: true, data: data });
  } catch (err) {
    console.log(err);
    res.send({ message: "Error in connection", status: false, error: err });
  }
});

// to create a new customer
router.post("/create-customer", async (req, res) => {
  try {
    // password encryption
    const hash = await pwdEncrypt(req.body.password);
    req.body.password = hash;

    const data = await customer.create(req.body);
    res.send({ message: "Account created!", status: true, data: data });
  } catch (err) {
    console.log(err);
    res.send({ message: "Error in connection!", status: false, error: err });
  }
});

// customer login
router.post("/login", async (req, res) => {
  try {
    const user = await customer.findOne({ email: req.body.email });
    console.log(user);
    if (user) {
      // password comparison
      const compare = await pwdCompare(req.body.password, user.password);
      if (compare) {
        res.send({ message: "Login Successfull!", status: true, data: user });
      } else {
        res.send({ message: "Invalid email or password", status: false });
      }
    } else {
      res.send({ message: "User not available!", status: false });
    }
  } catch (err) {
    console.log(err);
    res.send({ message: "Error in connection!", status: false, error: err });
  }
});

module.exports = router;
