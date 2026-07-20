const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
} = require("../controllers/wishlistController");

router.post("/add", authMiddleware, addToWishlist);

router.get("/", authMiddleware, getWishlist);

router.delete("/remove/:id", authMiddleware, removeFromWishlist);

module.exports = router;
const Wishlist = require("../models/Wishlist");

const addToWishlist = async (req, res) => {
    try {
        const wishlist = await Wishlist.create({
            userId: req.user.id,
            packageId: req.body.packageId
        });

        res.status(201).json({
            message: "Added to wishlist",
            wishlist
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const getWishlist = async (req, res) => {
    try {
        const wishlist = await Wishlist.find({
            userId: req.user.id
        }).populate("packageId");

        res.json(wishlist);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const removeFromWishlist = async (req, res) => {
    try {
        await Wishlist.findByIdAndDelete(req.params.id);

        res.json({
            message: "Removed from wishlist"
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    addToWishlist,
    getWishlist,
    removeFromWishlist
};