const express = require("express");
const router = express.Router();
const {
    createPackage,
    getPackages,
    getPackageById,
    updatePackage,
    deletePackage,
} = require("../controllers/packageController");

router.post("/", createPackage);
router.get("/", getPackages);
router.get("/:id", getPackageById);
router.put("/:id", updatePackage);
router.delete("/:id", deletePackage);

module.exports = router;