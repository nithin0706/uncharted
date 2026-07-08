import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ReviewForm from "../components/ReviewForm";
import ReviewList from "../components/ReviewList";
import "../styles/Reviews.css";

const Reviews = () => {
    const { packageId } = useParams();
    const [reviewData, setReviewData] = useState({ avgRating: 0, totalReviews: 0, reviews: [] });
    const [loading, setLoading] = useState(true);

    const fetchReviews = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/reviews`)
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

    if (loading) return <div className="rv-page"><p className="rv-loading">Loading reviews...</p></div>;

    return (
        <div className="rv-page">
            <div className="rv-container">
                <h2 className="rv-page-title">Reviews & Ratings</h2>
                <ReviewForm packageId={packageId} onReviewSubmitted={fetchReviews} />
                <ReviewList
                    reviews={reviewData.reviews}
                    avgRating={reviewData.avgRating}
                    totalReviews={reviewData.totalReviews}
                />
            </div>
        </div>
    );
};

export default Reviews;
