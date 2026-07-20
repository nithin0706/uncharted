const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const {
  createBooking,
  getBookingById,
  getBookingHistory,
  cancelBooking,
} = require("../controllers/BookingController");

console.log({
  createBooking,
  getBookingById,
  getBookingHistory,
  cancelBooking,
});

router.post("/", protect, createBooking);

router.get("/history/:userId", getBookingHistory);

router.get("/:id", getBookingById);

router.put("/cancel/:id", cancelBooking);

module.exports = router;