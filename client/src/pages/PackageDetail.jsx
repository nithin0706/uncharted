import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "../api";
import { ArrowLeft, Heart, Clock, MapPin, Star, Check, X } from "lucide-react";
import {
  getWishlist,
  addToWishlist,
  removeWishlistItem,
} from "../services/wishlistService";

const PackageDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pkg, setPkg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [wishlisted, setWishlisted] = useState(false);
  const [wishlistId, setWishlistId] = useState(null);
  const [saving, setSaving] = useState(false);

  // Fetch the package itself
 // Fetch the package itself
useEffect(() => {
  let cancelled = false;

  console.log("API URL:", import.meta.env.VITE_API_URL);
  console.log("Package ID:", id);

  axios
    .get(`${import.meta.env.VITE_API_URL}/api/packages/${id}`)
    .then((res) => {
      if (!cancelled) setPkg(res.data);
    })
    .catch((err) => {
      console.error(err);
      if (!cancelled) setError(err.message || "Failed to load package");
    })
    .finally(() => {
      if (!cancelled) setLoading(false);
    });

  return () => {
    cancelled = true;
  };
}, [id]);

  // Check if this package is already wishlisted by the logged-in user
  useEffect(() => {
    const checkWishlist = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await getWishlist(token);
        const match = res.data.find(
          (item) => item.packageId && item.packageId._id === id
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
        const res = await addToWishlist({ packageId: id }, token);
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
    return <p className="text-[#F5F1E8] pt-32 px-8 text-center">Loading...</p>;

  if (error)
    return (
      <p className="text-red-400 pt-32 px-8 text-center">
        Couldn't load package: {error}
      </p>
    );

  if (!pkg)
    return <p className="text-[#F5F1E8] pt-32 px-8 text-center">Package not found.</p>;

  const locationLabel =
    typeof pkg.destination === "object" && pkg.destination !== null
      ? pkg.destination.name || pkg.destination.location
      : null;

  return (
    <div className="min-h-screen bg-[#0B0B0F] text-[#F5F1E8] pt-32 px-6 md:px-8 pb-20">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[#C9A227] mb-8 bg-transparent hover:text-[#E8C766] transition-colors"
        >
          <ArrowLeft size={18} /> Back
        </button>

        {/* ── Hero image ── */}
        <img
          src={
            pkg.images?.[0] ||
            "https://placehold.co/1200x600/16161C/9A958A?text=Uncharted"
          }
          alt={pkg.name}
          className="w-full h-80 md:h-96 object-cover rounded-2xl mb-8"
        />

        {/* ── Title + Wishlist ── */}
        <div className="flex items-start justify-between gap-4 mb-3">
          <h1 className="text-3xl md:text-4xl font-bold">{pkg.name}</h1>

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

        {/* ── Meta row: location, duration, rating, price ── */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mb-8 text-sm">
          {locationLabel && (
            <span className="flex items-center gap-1.5 text-[#9A958A]">
              <MapPin size={16} className="text-[#C9A227]" />
              {locationLabel}
            </span>
          )}
          <span className="flex items-center gap-1.5 text-[#9A958A]">
            <Clock size={16} className="text-[#C9A227]" />
            {pkg.duration} {pkg.duration === 1 ? "Day" : "Days"}
          </span>
          <span className="flex items-center gap-1.5 text-[#9A958A]">
            <Star size={16} className="text-[#C9A227] fill-[#C9A227]" />
            {pkg.ratings > 0 ? pkg.ratings.toFixed(1) : "New"}
          </span>
          <span className="text-2xl font-semibold text-[#C9A227] ml-auto">
            ₹{pkg.price?.toLocaleString("en-IN")}
          </span>
        </div>

        {/* ── Itinerary ── */}
        {pkg.itinerary?.length > 0 && (
          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-4">Itinerary</h2>
            <ol className="space-y-3">
              {pkg.itinerary
                .slice()
                .sort((a, b) => a.day - b.day)
                .map((stop, i) => (
                  <li
                    key={i}
                    className="flex gap-4 bg-[#16161C] border border-[#25252d] rounded-xl p-4"
                  >
                    <span className="shrink-0 w-10 h-10 rounded-full bg-[#C9A227]/15 text-[#C9A227] font-semibold flex items-center justify-center">
                      {stop.day}
                    </span>
                    <p className="text-[#F5F1E8] leading-relaxed pt-1.5">
                      {stop.activity}
                    </p>
                  </li>
                ))}
            </ol>
          </section>
        )}

        {/* ── Inclusions / Exclusions ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          {pkg.inclusions?.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold mb-4">Inclusions</h2>
              <ul className="space-y-2">
                {pkg.inclusions.map((inc, i) => (
                  <li key={i} className="flex items-start gap-2 text-[#9A958A]">
                    <Check size={16} className="text-[#4ADE80] mt-0.5 shrink-0" />
                    {inc}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {pkg.exclusions?.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold mb-4">Exclusions</h2>
              <ul className="space-y-2">
                {pkg.exclusions.map((exc, i) => (
                  <li key={i} className="flex items-start gap-2 text-[#9A958A]">
                    <X size={16} className="text-red-400 mt-0.5 shrink-0" />
                    {exc}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        {/* ── Travel dates ── */}
        {pkg.travelDates?.length > 0 && (
          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-4">Available Travel Dates</h2>
            <div className="flex flex-wrap gap-2">
              {pkg.travelDates.map((d, i) => (
                <span
                  key={i}
                  className="text-sm bg-[#16161C] border border-[#25252d] text-[#F5F1E8] px-3 py-1.5 rounded-full"
                >
                  {new Date(d).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* ── Extra gallery images ── */}
        {pkg.images?.length > 1 && (
          <section>
            <h2 className="text-xl font-semibold mb-4">Gallery</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {pkg.images.slice(1).map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`${pkg.name}-${i}`}
                  className="w-full h-40 object-cover rounded-xl"
                />
              ))}
            </div>
          </section>
        )}

        {locationLabel && typeof pkg.destination === "object" && pkg.destination._id && (
          <Link
            to={`/destinations/${pkg.destination._id}`}
            className="inline-block mt-10 text-sm text-[#C9A227] hover:text-[#E8C766] transition-colors"
          >
            View destination: {locationLabel} →
          </Link>
        )}
      </div>
    </div>
  );
};

export default PackageDetail;