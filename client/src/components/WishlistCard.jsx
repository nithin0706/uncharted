import { Heart, CalendarDays, Star, IndianRupee } from "lucide-react";

function WishlistCard({ item, removeFromWishlist }) {
  return (
    <div className="wishlist-card">

      <div className="wishlist-header">

        <Heart
          fill="#C9A227"
          color="#C9A227"
          size={24}
        />

        <h2>{item.packageId.name}</h2>

      </div>

      <div className="wishlist-info">

        <p>
          <CalendarDays size={18} />
          {item.packageId.duration} Days
        </p>

        <p>
          <Star
            size={18}
            fill="#C9A227"
            color="#C9A227"
          />
          {item.packageId.ratings}/5
        </p>

        <p>
          <IndianRupee size={18} />
          ₹{item.packageId.price}
        </p>

      </div>

      <button
        className="wishlist-btn"
        onClick={() => removeFromWishlist(item._id)}
      >
        Remove
      </button>

    </div>
  );
}

export default WishlistCard;