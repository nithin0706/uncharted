const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const {
  createBuddyRequest,
  getAllBuddyRequests,
  getMatches,
  getMyRequest,
  sendBuddyRequest,
  getIncomingRequests,
  acceptBuddyRequest,
} = require("../controllers/travelBuddyController");

router.post("/request", protect, createBuddyRequest);

router.get("/", protect, getAllBuddyRequests);

router.get("/matches", protect, getMatches);

router.get("/my-request", protect, getMyRequest);

router.post("/request/:id", protect, sendBuddyRequest);

router.get("/incoming-requests", protect, getIncomingRequests);

router.post("/accept/:userId", protect, acceptBuddyRequest);

module.exports = router;