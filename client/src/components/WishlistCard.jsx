import { Link } from "react-router-dom";
import { Star, Clock, Heart } from "lucide-react";

// Same blurb logic as DestinationCard, so wishlist packages read identically.
function buildBlurb(pkg) {
  if (pkg.inclusions?.length) {
    return `Includes ${pkg.inclusions.slice(0, 3).join(", ")}.`;
  }
  return "Details available on request.";
}

function WishlistCard({ item, removeFromWishlist }) {
  if (!item) return null;

  const pkg = item.packageId || item.destinationId;
  if (!pkg) return null;

  const locationLabel =
    typeof pkg.destination === "object" && pkg.destination !== null
      ? pkg.destination.name || pkg.destination.location
      : pkg.location || null;

  const image =
    pkg.images?.[0] ||
    pkg.destination?.images?.[0] ||
    "https://placehold.co/600x400/16161C/9A958A?text=Uncharted";

  const linkTo = item.packageId
    ? `/packages/${pkg._id}`
    : `/destinations/${pkg._id}`;

  return (
    <article className="group bg-[#16161C] border border-[#25252d] rounded-xl overflow-hidden flex flex-col hover:border-[#C9A227]/40 transition-colors">
      <div className="relative h-56 overflow-hidden">
        <img
          src={image}
          alt={pkg.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        <button
          onClick={() => removeFromWishlist(item._id)}
          aria-label="Remove from wishlist"
          title="Remove from wishlist"
          className="absolute top-3 right-3 z-10 flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer backdrop-blur-md transition-colors bg-[#C9A227] text-[#0B0B0F] hover:bg-[#E8C766]"
        >
          <Heart size={14} fill="currentColor" />
          Remove
        </button>

        <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-black/40 backdrop-blur-md text-[#E8C766] text-xs font-semibold px-3 py-1 rounded-full">
          <Clock size={12} />
          {pkg.duration} {pkg.duration === 1 ? "Day" : "Days"}
        </div>
      </div>

      <div className="p-5 flex flex-col grow ">
        <div className="flex justify-between items-start gap-3 mb-1">
          <h3 className="text-lg font-semibold text-[#F5F1E8] leading-snug">
            {pkg.name}
          </h3>
          <p className="text-lg font-semibold text-[#C9A227] whitespace-nowrap">
            ₹{pkg.price?.toLocaleString("en-IN")}
          </p>
        </div>

        {locationLabel && (
          <p className="text-sm text-[#9A958A] mb-2">{locationLabel}</p>
        )}

        <div className="flex items-center gap-1 mb-3">
          <Star size={14} className="text-[#C9A227] fill-[#C9A227]" />
          <span className="text-sm font-medium text-[#F5F1E8]">
            {pkg.ratings > 0 ? pkg.ratings.toFixed(1) : "New"}
          </span>
        </div>

        <p className="text-sm text-[#9A958A] mb-4 grow line-clamp-2">
          {buildBlurb(pkg)}
        </p>

        <Link
          to={linkTo}
          className="w-full text-center py-2.5 rounded-lg bg-[#C9A227] text-[#0B0B0F] font-semibold hover:bg-[#E8C766] active:scale-95 transition-all"
        >
          View Details
        </Link>
      </div>
    </article>
  );
}

export default WishlistCard;