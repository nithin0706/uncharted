const express = require("express");

const router = express.Router();

const {
    createBooking,
    getBookingById,
    getBookingHistory,
    cancelBooking
} = require("../controllers/BookingController");

router.post("/", createBooking);

router.get("/history/:userId", getBookingHistory);

router.get("/:id", getBookingById);

router.put("/cancel/:id", cancelBooking);

module.exports = router;