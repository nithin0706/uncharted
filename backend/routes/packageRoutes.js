const express = require("express");
const router = express.Router();
const { createPackage, getPackages, getPackageById, updatePackage, deletePackage } = require("../controllers/packageController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.get("/", getPackages);
router.get("/:id", getPackageById);
router.post("/", protect, adminOnly, createPackage);
router.put("/:id", protect, adminOnly, updatePackage);
router.delete("/:id", protect, adminOnly, deletePackage);

module.exports = router;