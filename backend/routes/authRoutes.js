const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { login, register, getProfile } = require("../controllers/authController");

router.post("/login", login);
router.post("/register", register);
router.get("/profile", protect, getProfile);

module.exports = router;