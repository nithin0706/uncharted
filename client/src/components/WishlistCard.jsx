function WishlistCard({ item, removeFromWishlist }) {
  return (
    <div>
      <h3>{item.packageName}</h3>
      <p>Destination: {item.destination}</p>
      <p>Price: ₹{item.price}</p>
      <button onClick={() => removeFromWishlist(item.id)}> Remove </button>
    </div>
  );
}

export default WishlistCard;