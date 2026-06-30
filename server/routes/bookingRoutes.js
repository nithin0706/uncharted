const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
    createBooking,
    getBookingById,
    getBookingHistory,
    cancelBooking
} = require("../controllers/BookingController");

router.post("/", authMiddleware, createBooking);

router.get("/history/:userId", getBookingHistory);

router.get("/:id", getBookingById);

router.put("/cancel/:id", cancelBooking);

module.exports = router;