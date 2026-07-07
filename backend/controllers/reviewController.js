const Review = require("../models/Review");
const Package = require("../models/package");
const User = require("../models/User");

const createReview = async (req, res) => {
    try {
        const { packageId, rating, reviewText } = req.body;

        const package_ = await Package.findById(packageId);
        if (!package_) {
            return res.status(404).json({ message: "Package not found" });
        }

        const existingReview = await Review.findOne({
            userId: req.user.id,
            packageId,
        });
        if (existingReview) {
            return res.status(400).json({ message: "You have already reviewed this package" });
        }

        const review = new Review({
            userId: req.user.id,
            packageId,
            rating,
            reviewText,
        });
        await review.save();

        // Calculate and update average rating on the package
        const allReviews = await Review.find({ packageId });
        const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
        await Package.findByIdAndUpdate(packageId, { ratings: avgRating.toFixed(1) });

        res.status(201).json({ message: "Review submitted successfully", review });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const getReviewsByPackage = async (req, res) => {
    try {
        const reviews = await Review.find({ packageId: req.params.packageId })
            .populate("userId", "name")
            .sort({ createdAt: -1 });

        const avgRating = reviews.length
            ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
            : 0;

        res.status(200).json({ avgRating, totalReviews: reviews.length, reviews });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = { createReview, getReviewsByPackage };
