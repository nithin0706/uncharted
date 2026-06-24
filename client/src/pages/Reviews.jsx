import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ReviewForm from "../components/ReviewForm";
import ReviewList from "../components/ReviewList";

const Reviews = () => {
    const { packageId } = useParams();
    const [reviewData, setReviewData] = useState({ avgRating: 0, totalReviews: 0, reviews: [] });
    const [loading, setLoading] = useState(true);

    const fetchReviews = async () => {
        try {
            const res = await axios.get(`http://localhost:5001/api/reviews/${packageId}`);
            setReviewData(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, [packageId]);

    if (loading) return <p>Loading reviews...</p>;

    return (
        <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
            <h2>Reviews & Ratings</h2>
            <ReviewForm packageId={packageId} onReviewSubmitted={fetchReviews} />
            <ReviewList
                reviews={reviewData.reviews}
                avgRating={reviewData.avgRating}
                totalReviews={reviewData.totalReviews}
            />
        </div>
    );
};

export default Reviews;