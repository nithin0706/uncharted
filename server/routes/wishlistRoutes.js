const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
    addToWishlist,
    getWishlist,
    removeFromWishlist
} = require("../controllers/wishlistController");

router.post("/add", authMiddleware, addToWishlist);

router.get("/", authMiddleware, getWishlist);

router.delete("/remove/:id", authMiddleware, removeFromWishlist);

module.exports = router;