import { Link } from "react-router-dom";
import { Star, Clock } from "lucide-react";
import { useCompare } from "../context/CompareContext";

// Package.inclusions is the closest thing we have to a description in the
// current schema — join a few of them into a short blurb. If you later add
// a real `description` field to the Package model, swap this out.
function buildBlurb(pkg) {
  if (pkg.inclusions?.length) {
    return `Includes ${pkg.inclusions.slice(0, 3).join(", ")}.`;
  }
  return "Details available on request.";
}

export default function DestinationCard({ pkg }) {
  const { isComparing, toggleCompare, maxCompare, compareList } = useCompare();
  const checked = isComparing(pkg._id);
  const atLimit = !checked && compareList.length >= maxCompare;

  const locationLabel =
    typeof pkg.destination === "object" && pkg.destination !== null
      ? pkg.destination.name || pkg.destination.location
      : null;

  // Fall back to the parent Destination's image if this specific package
  // doesn't have its own images set yet.
  const image =
    pkg.images?.[0] ||
    pkg.destination?.images?.[0] ||
    "https://placehold.co/600x400/16161C/9A958A?text=Uncharted";

  return (
    <article className="group bg-[#16161C] border border-[#25252d] rounded-xl overflow-hidden flex flex-col hover:border-[#C9A227]/40 transition-colors">
      <div className="relative h-56 overflow-hidden">
        <img
          src={image}
          alt={pkg.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        <label
          className={`absolute top-3 right-3 z-10 flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer backdrop-blur-md transition-colors ${
            checked
              ? "bg-[#C9A227] text-[#0B0B0F]"
              : "bg-black/40 text-[#F5F1E8] hover:bg-black/60"
          } ${atLimit ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <input
            type="checkbox"
            className="w-3.5 h-3.5 accent-[#C9A227]"
            checked={checked}
            disabled={atLimit}
            onChange={() => toggleCompare(pkg._id)}
          />
          {checked ? "Added" : "Compare"}
        </label>

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
            {pkg.reviewCount > 0 ? pkg.avgRating.toFixed(1) : "New"}
          </span>
          {pkg.reviewCount > 0 && (
            <span className="text-xs text-[#9A958A]">
              ({pkg.reviewCount} {pkg.reviewCount === 1 ? "review" : "reviews"})
            </span>
          )}
        </div>

        <p className="text-sm text-[#9A958A] mb-4 grow line-clamp-2">
          {buildBlurb(pkg)}
        </p>

        <Link
          to={`/destinations/${pkg._id}`}
          className="w-full text-center py-2.5 rounded-lg bg-[#C9A227] text-[#0B0B0F] font-semibold hover:bg-[#E8C766] active:scale-95 transition-all"
        >
          View Details
        </Link>
      </div>
    </article>
  );
}
