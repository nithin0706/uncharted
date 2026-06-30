function ReviewCard({ review }) {
    return (
        <div style={{ border: "1px solid #eee", borderRadius: "8px", padding: "12px", marginBottom: "12px" }}>
            <h3>{review.userId?.name || "User"}</h3>
            <p>Rating: {review.rating}/5</p>
            <p>{review.reviewText}</p>
        </div>
    );
}
export default ReviewCard;