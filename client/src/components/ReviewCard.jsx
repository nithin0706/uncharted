function ReviewCard({ review }) {
  return (
    <div>
      <h3>{review.user}</h3>
      <p>Rating: {review.rating}/5</p>
      <p>{review.comment}</p>
    </div>
  );
}

export default ReviewCard;