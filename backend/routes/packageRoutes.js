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

router.post("/", createPackage);
router.get("/", getPackages);
router.get("/compare", comparePackages);   // must be before /:id
router.get("/:id", getPackageById);
router.put("/:id", updatePackage);
router.delete("/:id", deletePackage);

module.exports = router;