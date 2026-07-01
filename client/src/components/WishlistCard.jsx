import { Heart, CalendarDays, Star, IndianRupee, MapPin } from "lucide-react";

function WishlistCard({ item, removeFromWishlist }) {
  const data = item.packageId || item.destinationId;
  const isPackage = Boolean(item.packageId);

  if (!data) return null;

  return (
    <div className="wishlist-card">
      <div className="wishlist-header">
        <Heart fill="#C9A227" color="#C9A227" size={24} />
        <h2>{data.name}</h2>
      </div>

      <div className="wishlist-info">
        {isPackage ? (
          <>
            <p>
              <CalendarDays size={18} />
              {data.duration} Days
            </p>
            <p>
              <Star size={18} fill="#C9A227" color="#C9A227" />
              {data.ratings}/5
            </p>
            <p>
              <IndianRupee size={18} />₹{data.price}
            </p>
          </>
        ) : (
          <p>
            <MapPin size={18} />
            {data.location}
          </p>
        )}
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
