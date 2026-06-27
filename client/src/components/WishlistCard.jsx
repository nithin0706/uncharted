function WishlistCard({ item, removeFromWishlist }) {
  return (
    <div>
      <h3>{item.packageId.name}</h3>

      <p>Duration: {item.packageId.duration} days</p>

      <p>Price: ₹{item.packageId.price}</p>

      <p>Rating: {item.packageId.ratings}/5</p>

      <button onClick={() => removeFromWishlist(item._id)}>
        Remove
      </button>
    </div>
  );
}

export default WishlistCard;