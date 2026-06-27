import React, { useState } from "react";
import ReviewCard from "../components/ReviewCard";

const Reviews = () => {
  const [reviews, setReviews] = useState([
    {
      user: "Rahul",
      rating: 5,
      comment: "Amazing trip experience!",
    },
    {
      user: "Anjali",
      rating: 4,
      comment: "Beautiful locations and great guides.",
    },
  ]);
  const [user, setUser] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  
  const handleSubmit = () => {
  const newReview = {
    user: user,
    rating: rating,
    comment: comment,
  };
  setReviews([...reviews, newReview]);
  setUser("");
 setRating(5);
 setComment("");
  console.log(newReview);
};
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">User Reviews</h2>
      <div
  style={{
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    width: "400px",
    margin: "0 auto 24px auto",
    padding: "20px",
    border: "1px solid gray",
    borderRadius: "8px"
  }}
>
  <input
    type="text"
    placeholder="Your name"
    value={user}
    onChange={(e) => setUser(e.target.value)}
    className="block border p-2 rounded w-full mb-3"
  />

  <div>
  <p>Rating:</p>

  {[1, 2, 3, 4, 5].map((star) => (
    <span
      key={star}
      onClick={() => setRating(star)}
      style={{
        cursor: "pointer",
        fontSize: "30px",
      }}
    >
      {star <= rating ? "★" : "☆"}
    </span>
  ))}

  <p>Current rating: {rating}</p>
</div>

  <textarea
    placeholder="Write your review..."
    value={comment}
    onChange={(e) => setComment(e.target.value)}
    className="block border p-2 rounded w-full mb-3"
  />

  <button onClick= {handleSubmit} className="block bg-blue-500 text-white px-4 py-2 rounded">
    Submit Review
  </button>
</div>
      {reviews.map((review, index) => (
  <ReviewCard
    key={index}
    review={review}
  />
))}
    </div>
  );
};

export default Reviews;