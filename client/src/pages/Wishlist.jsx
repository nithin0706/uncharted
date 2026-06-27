import { useState, useEffect } from "react";
import WishlistCard from "../components/WishlistCard";
import {
  getWishlist,
  removeWishlistItem,
} from "../services/wishlistService";

function Wishlist() {
 

  const mockWishlist = [
  {
    id: 1,
    packageName: "Kerala Backwaters Tour",
    destination: "Alappuzha",
    price: 15000,
  },
  {
    id: 2,
    packageName: "Munnar Hills Escape",
    destination: "Munnar",
    price: 12000,
  },
];

const [wishlist, setWishlist] = useState([]);
useEffect(() => {
    const fetchWishlist = async () => {
    const token = localStorage.getItem("token");

    console.log("Token:", token);

    const response = await getWishlist(token);

    setWishlist(response.data);
};

    fetchWishlist();
}, []);
    const removeFromWishlist = async (id) => {
  try {
    const token = localStorage.getItem("token");

    await removeWishlistItem(id, token);

    setWishlist(
      wishlist.filter((item) => item._id !== id)
    );

    console.log("Removed successfully");
  } catch (error) {
    console.error(error);
    alert("Failed to remove item");
  }
};

  return (
    <div>
      <h1>My Wishlist</h1>

      {wishlist.length === 0 ? (
  <p>No packages in your wishlist.</p>
) : (
  wishlist.map((item) => (
    <WishlistCard
      key={item.id}
      item={item}
      removeFromWishlist={removeFromWishlist}
    />
  ))
)}
    </div>
  );
}

export default Wishlist;