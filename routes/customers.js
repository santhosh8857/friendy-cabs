var express = require("express");
var router = express.Router();
const env = require("dotenv").config();

const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");
const customer = require("../models/Customer");
const driver = require("../models/Driver");

const { pwdEncrypt, pwdCompare } = require("../library/auth");

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

// Book ride - takes driver id from URL and customer id from body
//  from, to distance and fare taken from body
router.post("/book-ride/:id", async (req, res) => {
  try {
    // creates unique ID for each rides
    const rideID = new ObjectId();

    const driverData = await driver.findById(req.params.id);
    const customerData = await customer.findById(req.body.customerId);

    // verifying wallet balance
    if (req.body.fare < customerData.wallet) {
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
          message: "Ride Booked!",
          status: true,
          data: { ...req.body, ...rideDetails },
        });
      } else {
        res.send({
          message: "Customer or Driver is not available.",
          staus: false,
        });
      }
    } else {
      res.send({
        message: "Invalid balance! Kindly recharge your account.",
        status: false,
      });
    }
  } catch (err) {
    console.log(err);
    res.send({ message: "Error in connection!", status: false });
  }
});

// cancell with deduction
router.put("/cancel-ride", async (req, res) => {
  let deduction = null;

  try {
    const driverData = await driver.findById(req.body.driverId);
    const customerData = await customer.findById(req.body.customerId);

    const updateDriver = () => {
      driverData.rideHistory.map((ride) => {
        if (ObjectId(req.body.rideId).equals(ride.rideId)) {
          ride.rideStatus.status = "Cancelled";
          ride.rideStatus.value = -1;
          driverData.available = true;
        }
      });
    };

    customerData.rideHistory.map((ride) => {
      if (ObjectId(req.body.rideId).equals(ride.rideId)) {
        deduction = (5 / 100) * ride.fare;
        // to check whether the ride is started or not
        if (ride.rideStatus.value === 1) {
          customerData.wallet = customerData.wallet - deduction;
          ride.rideStatus.status = "Cancelled";
          ride.rideStatus.value = -1;
          updateDriver();
        }
      }
    });

    await driverData.markModified("rideHistory");
    await driverData.save();

    await customerData.markModified("rideHistory"); //
    await customerData.save();

    res.send({
      message: "Ride cancelled!",
      status: true,
      rideDetails: driverData.rideHistory,
      amountDeducted: deduction,
      currentBalance: customerData.wallet,
    });
  } catch (err) {
    console.log(err);
    res.send({ message: "Error in connection!", status: false, error: err });
  }
});

module.exports = router;
