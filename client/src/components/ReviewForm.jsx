import { useState } from "react";
import axios from "axios";
import StarRating from "./StarRating";

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
        <div style={{ border: "1px solid #ccc", borderRadius: "8px", padding: "16px", marginBottom: "20px" }}>
            <h3>Write a Review</h3>
            <StarRating rating={rating} onRatingChange={setRating} />
            <textarea
                placeholder="Write your review here..."
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                rows={4}
                style={{ width: "100%", marginTop: "12px", padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }}
            />
            {error && <p style={{ color: "red" }}>{error}</p>}
            {success && <p style={{ color: "green" }}>{success}</p>}
            <button
                onClick={handleSubmit}
                style={{ marginTop: "10px", padding: "10px 20px", backgroundColor: "#4CAF50", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" }}
            >
                Submit Review
            </button>
        </div>
    );
};

export default ReviewForm;