const express = require("express");
const router = express.Router();

// to get driver details
router.get("/", async (req, res) => {
  res.send({ message: "Success!", status: true });
});

module.exports = router;
