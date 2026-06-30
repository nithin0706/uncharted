const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const {
  getAllReviews,
  approveReview,
  rejectReview,
  editReview,
  deleteReview,
  getAllUsers,
  deleteUser,
} = require("../controllers/adminController");

router.get("/reviews", protect, adminMiddleware, getAllReviews);
router.patch("/reviews/:id/approve", protect, adminMiddleware, approveReview);
router.patch("/reviews/:id/reject", protect, adminMiddleware, rejectReview);
router.put("/reviews/:id", protect, adminMiddleware, editReview);
router.delete("/reviews/:id", protect, adminMiddleware, deleteReview);

router.get("/users", protect, adminMiddleware, getAllUsers);
router.delete("/users/:id", protect, adminMiddleware, deleteUser);

module.exports = router;