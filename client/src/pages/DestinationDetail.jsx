import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { MapPin, ArrowLeft, Heart } from "lucide-react";
import {
  getWishlist,
  addToWishlist,
  removeWishlistItem,
} from "../services/wishlistService";

const DestinationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [wishlisted, setWishlisted] = useState(false);
  const [wishlistId, setWishlistId] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/destinations/${id}`)
      .then((res) => {
        setDestination(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  // check if this destination is already in the logged-in user's wishlist
  useEffect(() => {
    const checkWishlist = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await getWishlist(token);
        const match = res.data.find(
          (item) => item.destinationId && item.destinationId._id === id
        );
        if (match) {
          setWishlisted(true);
          setWishlistId(match._id);
        }
      } catch (err) {
        console.error(err);
      }
    };

    checkWishlist();
  }, [id]);

  const toggleWishlist = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    setSaving(true);
    try {
      if (wishlisted) {
        await removeWishlistItem(wishlistId, token);
        setWishlisted(false);
        setWishlistId(null);
      } else {
        const res = await addToWishlist({ destinationId: id }, token);
        setWishlisted(true);
        setWishlistId(res.data.wishlist._id);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to update wishlist");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return <p className="text-[#F5F1E8] pt-32 px-8">Loading...</p>;
  if (!destination)
    return (
      <p className="text-[#F5F1E8] pt-32 px-8">Destination not found.</p>
    );

  return (
    <div className="min-h-screen bg-[#0B0B0F] text-[#F5F1E8] pt-32 px-8 pb-20">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[#C9A227] mb-8 bg-transparent hover:text-[#E8C766] transition-colors"
        >
          <ArrowLeft size={18} /> Back
        </button>

        {destination.images?.[0] && (
          <img
            src={destination.images[0]}
            alt={destination.name}
            className="w-full h-96 object-cover rounded-2xl mb-8"
          />
        )}

        <div className="flex items-start justify-between gap-4 mb-4">
          <h1 className="text-4xl font-bold">{destination.name}</h1>

          <button
            onClick={toggleWishlist}
            disabled={saving}
            className="shrink-0 p-3 rounded-full border border-[#C9A227] bg-transparent hover:bg-[#C9A227]/10 transition-all disabled:opacity-50"
            aria-label="Toggle wishlist"
          >
            <Heart
              size={24}
              fill={wishlisted ? "#C9A227" : "none"}
              color="#C9A227"
            />
          </button>
        </div>

        <p className="text-[#C9A227] font-semibold mb-2 flex items-center gap-2">
          <MapPin size={18} />
          <span className="text-[#F5F1E8] font-normal">
            {destination.location}
          </span>
        </p>

        <p className="text-[#9A958A] text-lg leading-relaxed mb-10">
          {destination.description}
        </p>

        {destination.images?.length > 1 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {destination.images.slice(1).map((img, i) => (
              <img
                key={i}
                src={img}
                alt={`${destination.name}-${i}`}
                className="w-full h-40 object-cover rounded-xl"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DestinationDetail;