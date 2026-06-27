import { useState, useEffect } from "react";
import WishlistCard from "../components/WishlistCard";
import { getWishlist } from "../services/wishlistService";

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

    console.log(response.data);
};

    fetchWishlist();
}, []);
    const removeFromWishlist = (id) => {
        setWishlist(wishlist.filter((item) => item.id !== id));
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