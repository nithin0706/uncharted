const express = require("express");

const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const {
    createBooking,
    getBookingById,
    getBookingHistory,
    cancelBooking
} = require("../controllers/BookingController");

router.post("/", protect, createBooking);

router.get("/history/:userId", protect, getBookingHistory);

router.get("/:id", protect, getBookingById);

router.put("/cancel/:id", protect, cancelBooking);

module.exports = router;