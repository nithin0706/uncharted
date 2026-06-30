const express = require("express");
const router = express.Router();
const { createReview, getReviewsByPackage } = require("../controllers/reviewController");
const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, createReview);
router.get("/:packageId", getReviewsByPackage);

module.exports = router;