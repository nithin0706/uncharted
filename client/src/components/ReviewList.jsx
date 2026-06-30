import StarRating from "./StarRating";

const ReviewList = ({ reviews, avgRating, totalReviews }) => {
    return (
        <div>
            <div style={{ marginBottom: "16px" }}>
                <h3>Customer Reviews</h3>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <StarRating rating={Math.round(avgRating)} readOnly={true} />
                    <span style={{ fontSize: "18px", fontWeight: "bold" }}>{avgRating}</span>
                    <span style={{ color: "#555" }}>({totalReviews} reviews)</span>
                </div>
            </div>
            {reviews.length === 0 ? (
                <p>No reviews yet. Be the first to review!</p>
            ) : (
                reviews.map((review) => (
                    <div key={review._id} style={{ border: "1px solid #eee", borderRadius: "8px", padding: "12px", marginBottom: "12px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <strong>{review.userId?.name || "User"}</strong>
                            <span style={{ fontSize: "12px", color: "#888" }}>
                                {new Date(review.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                        <StarRating rating={review.rating} readOnly={true} />
                        <p style={{ marginTop: "8px" }}>{review.reviewText}</p>
                    </div>
                ))
            )}
        </div>
    );
};

export default ReviewList;