import { useState } from "react";
import axios from "axios";
import StarRating from "./StarRating";
import "../styles/Reviews.css";

const ReviewForm = ({ packageId, onReviewSubmitted }) => {
    const [rating, setRating] = useState(0);
    const [reviewText, setReviewText] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleSubmit = async () => {
        if (!rating) return setError("Please select a rating");
        if (!reviewText.trim()) return setError("Please write a review");

        try {
            const token = localStorage.getItem("token");
            await axios.post(
                "http://localhost:5001/api/reviews",
                { packageId, rating, reviewText },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setSuccess("Review submitted successfully!");
            setError("");
            setRating(0);
            setReviewText("");
            onReviewSubmitted();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to submit review");
        }
    };

    return (
        <div className="rv-form">
            <h3 className="rv-form-title">Write a Review</h3>
            <StarRating rating={rating} onRatingChange={setRating} />
            <textarea
                className="rv-textarea"
                placeholder="Write your review here..."
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                rows={4}
            />
            {error && <p className="rv-error">{error}</p>}
            {success && <p className="rv-success">{success}</p>}
            <button className="rv-submit-btn" onClick={handleSubmit}>
                Submit Review
            </button>
        </div>
    );
};

export default ReviewForm;
