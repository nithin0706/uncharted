import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import WishlistCard from "../components/WishlistCard";
import { getWishlist, removeWishlistItem } from "../services/wishlistService";
import "./Wishlist.css";

function Wishlist() {
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await getWishlist(token);
      setWishlist(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const removeFromWishlist = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await removeWishlistItem(id, token);

      setWishlist((prev) =>
        prev.filter((item) => item._id !== id)
      );
    } catch (error) {
      console.error(error);
      alert("Failed to remove item");
    }
  };

  return (
    <div className="wishlist-page">

      <section className="wishlist-hero">

        <p className="wishlist-tag">
          YOUR FAVOURITES
        </p>

        <h1>
          My <span>Wishlist</span>
        </h1>

        <p className="wishlist-subtitle">
          Save your favourite travel packages and keep them ready for your next adventure.
        </p>

      </section>

      {wishlist.length === 0 ? (
        <div className="wishlist-empty">

          <Heart size={60} />

          <h2>Your wishlist is empty</h2>

          <p>
            Start exploring and save your favourite travel packages.
          </p>

        </div>
      ) : (
        <div className="wishlist-grid">

          {wishlist.map((item) => (
            <WishlistCard
              key={item._id}
              item={item}
              removeFromWishlist={removeFromWishlist}
            />
          ))}

        </div>
      )}

    </div>
  );
}

export default Wishlist;