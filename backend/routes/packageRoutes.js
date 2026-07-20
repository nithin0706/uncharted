const express = require("express");
const router = express.Router();
const {
    createPackage,
    getPackages,
    getPackageById,
    updatePackage,
    deletePackage,
    comparePackages,
} = require("../controllers/packageController");
const { protect } = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

router.post("/", protect, adminMiddleware, createPackage);
router.get("/", getPackages);
router.get("/compare", comparePackages);   // must be before /:id
router.get("/:id", getPackageById);
router.put("/:id", protect, adminMiddleware, updatePackage);
router.delete("/:id", protect, adminMiddleware, deletePackage);

module.exports = router;