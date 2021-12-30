var express = require("express");
var router = express.Router();
const env = require("dotenv").config();

const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");
const customer = require("../models/Customer");
const driver = require("../models/Driver");

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

// ** Main logic ** //

// Recharge wallet
router.put("/recharge/:id", async (req, res) => {
  try {
    // const data = await customer.updateOne(
    //   { _id: Object(req.params.id) },
    //   { $inc: { wallet: req.body.value } }
    // );
    const user = await customer.findById(req.params.id);
    user.wallet = user.wallet + req.body.value;
    await user.save();

    res.send({ message: "Recharge successfull", status: true, data: user });
  } catch (err) {
    console.log(err);
    res.send({ message: "Error in connection!", status: false, error: err });
  }
});

// Book ride - takes driver id in URL and customer id in body
router.post("/book-ride/:id", async (req, res) => {
  try {
    // creates unique ID for each rides
    const rideID = new ObjectId();

    const driverData = await driver.findById(req.params.id);
    const customerData = await customer.findById(req.body.customerId);

    if (driverData.length !== 0 && customerData.length !== 0) {
      // creating obj for additional ride information
      let rideDetails = {
        driverId: req.params.id,
        rideId: rideID,
        startDate: null,
        endDate: null,
        rideStatus: { status: "awaiting driver response", value: 0 }, // 0 - awaiting driver response, 1 - inprogress, 2 - completed, -1 - cancelled
        driverName: driverData.name,
        customerName: customerData.name,
      };

      // updating rideHistory in both driver and customer collections
      driverData.rideHistory.push({ ...req.body, ...rideDetails });
      await driverData.save();

      customerData.rideHistory.push({ ...req.body, ...rideDetails });
      await customerData.save();

      res.send({
        message: "Ride Booked",
        status: true,
        data: { ...req.body, ...rideDetails },
      });
    } else {
      res.send({
        message: "Customer or Driver is not available",
        staus: false,
      });
    }
  } catch (err) {
    console.log(err);
    res.send({ message: "Error in connection!", status: false });
  }
});

module.exports = router;
