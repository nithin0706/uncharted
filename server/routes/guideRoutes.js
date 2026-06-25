const express = require("express");
const router = express.Router();

const {
    createGuide,
    getGuides,
    getGuideById
} = require("../controllers/guideController");

router.post("/", createGuide);

router.get("/", getGuides);

router.get("/:id", getGuideById);

module.exports = router;