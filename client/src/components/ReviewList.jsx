import StarRating from "./StarRating";
import "../styles/Reviews.css";

const ReviewList = ({ reviews, avgRating, totalReviews }) => {
    return (
        <div className="rv-list-section">
            <div className="rv-list-header">
                <h3 className="rv-list-title">Customer Reviews</h3>
                <div className="rv-avg-row">
                    <StarRating rating={Math.round(avgRating)} readOnly={true} />
                    <span className="rv-avg-num">{avgRating}</span>
                    <span className="rv-avg-count">({totalReviews} reviews)</span>
                </div>
            </div>
            {reviews.length === 0 ? (
                <p className="rv-empty">No reviews yet. Be the first to review!</p>
            ) : (
                reviews.map((review) => (
                    <div key={review._id} className="rv-card">
                        <div className="rv-card-top">
                            <strong className="rv-card-name">{review.userId?.name || "User"}</strong>
                            <span className="rv-card-date">
                                {new Date(review.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                        <StarRating rating={review.rating} readOnly={true} />
                        <p className="rv-card-comment">{review.reviewText}</p>
                    </div>
                ))
            )}
        </div>
    );
};

export default ReviewList;