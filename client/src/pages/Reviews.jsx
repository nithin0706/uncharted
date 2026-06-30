import { useState, useEffect } from "react";
import axios from "axios";
import ReviewCard from "../components/ReviewCard";

const PACKAGE_ID = "6a37954ba9ac259147a5694b"; // replace with real packageId

const Reviews = () => {
    const [reviews, setReviews] = useState([]);
    const [avgRating, setAvgRating] = useState(0);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [error, setError] = useState("");

    const fetchReviews = async () => {
        try {
            const res = await axios.get(`http://localhost:5001/api/reviews/${PACKAGE_ID}`);
            setReviews(res.data.reviews);
            setAvgRating(res.data.avgRating);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => { fetchReviews(); }, []);

    const handleSubmit = async () => {
        if (!comment.trim()) return setError("Write a review");
        try {
            const token = localStorage.getItem("token");
            await axios.post("http://localhost:5001/api/reviews",
                { packageId: PACKAGE_ID, rating, reviewText: comment },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setComment("");
            setRating(5);
            setError("");
            fetchReviews();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to submit");
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">User Reviews</h2>
            <p>Average Rating: {avgRating} ★</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", width: "400px", margin: "0 auto 24px auto", padding: "20px", border: "1px solid gray", borderRadius: "8px" }}>
                <div>
                    <p>Rating:</p>
                    {[1, 2, 3, 4, 5].map((star) => (
                        <span key={star} onClick={() => setRating(star)} style={{ cursor: "pointer", fontSize: "30px" }}>
                            {star <= rating ? "★" : "☆"}
                        </span>
                    ))}
                </div>
                <textarea
                    placeholder="Write your review..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="block border p-2 rounded w-full mb-3"
                />
                {error && <p style={{ color: "red" }}>{error}</p>}
                <button onClick={handleSubmit} className="block bg-blue-500 text-white px-4 py-2 rounded">
                    Submit Review
                </button>
            </div>
            {reviews.map((review, index) => (
                <ReviewCard key={index} review={review} />
            ))}
        </div>
    );
};

export default Reviews;