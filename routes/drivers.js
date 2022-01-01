const express = require("express");
const router = express.Router();
const env = require("dotenv").config();
const moment = require("moment");

const mongoose = require("mongoose");
const driver = require("../models/Driver");
const customer = require("../models/Customer");

const { pwdEncrypt, pwdCompare } = require("../library/auth");
const { ObjectId } = require("mongodb");

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

// Accept ride
// takes ride, customer and driver ID in the body
router.put("/accept-ride", async (req, res) => {
  try {
    const driverData = await driver.findById(req.body.driverId);
    const customerData = await customer.findById(req.body.customerId);

    // to get the current time
    let date = moment().format("DD-MM-YYYY hh:mm:ss a");
    // iterate through driver ridehistory to update the ridestatus and startDate
    driverData.rideHistory.map((ride) => {
      // comparing manually created mongoDB objectID
      if (ObjectId(req.body.rideId).equals(ride.rideId)) {
        ride.rideStatus.status = "In progress";
        ride.rideStatus.value = 1;
        ride.startDate = date;
      }
    });

    // iterate through customer ridehistory to update the ridestatus and startDate
    customerData.rideHistory.map((ride) => {
      if (ObjectId(req.body.rideId).equals(ride.rideId)) {
        ride.rideStatus.status = "In progress";
        ride.rideStatus.value = 1;
        ride.startDate = date;
      }
    });

    // ** markModified is used to update the nested objects in mongoDB **//
    await driverData.markModified("rideHistory");
    await driverData.save();

    await customerData.markModified("rideHistory");
    await customerData.save();

    res.send({
      message: "Ride accepted!",
      status: true,
      rideDetails: driverData.rideHistory,
    });
  } catch (err) {
    console.log(err);
    res.send({ message: "Error in connection!", status: false, error: err });
  }
});

// Cancel ride
// takes ride, customer and driver ID in the body
router.put("/cancel-ride", async (req, res) => {
  try {
    const driverData = await driver.findById(req.body.driverId);
    const customerData = await customer.findById(req.body.customerId);

    // update rideStatus
    driverData.rideHistory.map((ride) => {
      if (ObjectId(req.body.rideId).equals(ride.rideId)) {
        ride.rideStatus.status = "Cancelled";
        ride.rideStatus.value = -1;
      }
    });

    customerData.rideHistory.map((ride) => {
      if (ObjectId(req.body.rideId).equals(ride.rideId)) {
        ride.rideStatus.status = "Cancelled";
        ride.rideStatus.value = -1;
      }
    });

    await driverData.markModified("rideHistory");
    await driverData.save();

    await customerData.markModified("rideHistory");
    await customerData.save();

    res.send({
      message: "Ride cancelled!",
      status: true,
      rideDetails: driverData.rideHistory,
    });
  } catch (err) {
    console.log(err);
    res.send({ message: "Error in connection!", status: false, error: err });
  }
});

router.put("/end-ride", async (req, res) => {
  try {
    const driverData = await driver.findById(req.body.driverId);
    const customerData = await customer.findById(req.body.customerId);

    let date = moment().format("DD-MM-YYYY hh:mm:ss a");

    driverData.rideHistory.map((ride) => {
      if (ObjectId(req.body.rideId).equals(ride.rideId)) {
        ride.endDate = date;
        driverData.wallet += ride.fare; // adding fare value to driver wallet
        ride.rideStatus.status = "Completed";
        ride.rideStatus.value = 2;
      }
    });

    customerData.rideHistory.map((ride) => {
      if (ObjectId(req.body.rideId).equals(ride.rideId)) {
        ride.endDate = date;
        customerData.wallet -= ride.fare; // reducing wallet value with fare
        ride.rideStatus.status = "Completed";
        ride.rideStatus.value = 2;
      }
    });

    await driverData.markModified("rideHistory");
    await driverData.save();

    await customerData.markModified("rideHistory");
    await customerData.save();

    res.send({
      message: "Ride completed!",
      status: true,
      rideDetails: driverData.rideHistory,
    });
  } catch (err) {
    console.log(err);
    res.send({ message: "Error in connection!", status: false, error: err });
  }
});

module.exports = router;
