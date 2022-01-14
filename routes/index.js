var express = require("express");
var router = express.Router();

const driver = require("../models/Driver");
const customer = require("../models/Customer");

const { ObjectId } = require("mongodb");

/* GET home page. */
router.get("/", async (req, res) => {
  try {
    const driverData = await driver.find();
    const customerData = await customer.find();

    res.send({
      message: "Success",
      status: true,
      data: { driverDetails: driverData, customerDetails: customerData },
    });
  } catch (err) {
    console.log(err);
    res.send({ message: "Error in connection", status: false, error: err });
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
        driverData.available = true;
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

module.exports = router;
