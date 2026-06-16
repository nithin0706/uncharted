const express = require("express");
const router = express.Router();
const { createDestination, getDestinations } = require("../controllers/destinationController");

router.post("/", createDestination);
router.get("/", getDestinations);

module.exports = router;