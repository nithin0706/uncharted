import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeftRight, X } from "lucide-react";
import axios from "axios";
import { useCompare } from "../context/CompareContext";
import DestinationCard from "../components/DestinationCard";
import FilterBar, { PRICE_BANDS, DURATION_BANDS } from "../components/FilterBar";

// Debounce delay for the free-text search box, so we don't fire a request
// on every keystroke.
const SEARCH_DEBOUNCE_MS = 350;

export default function DestinationsPage() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Locations for the filter dropdown, and destination "browse" cards
  // (with images) — both derived from an unfiltered fetch done once on
  // mount, so they don't shrink as the user applies filters below.
  const [locationOptions, setLocationOptions] = useState([]);
  const [destinationBrowseCards, setDestinationBrowseCards] = useState([]);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [location, setLocation] = useState("");
  const [priceBandIndex, setPriceBandIndex] = useState(0);
  const [durationBandIndex, setDurationBandIndex] = useState(0);

  const { compareList } = useCompare();

  // Debounce the search box.
  useEffect(() => {
    const handle = setTimeout(() => setDebouncedSearch(search), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(handle);
  }, [search]);

  // One-time fetch (unfiltered) to build the location dropdown AND the
  // destination browse row (dedup by destination _id, keep one image each).
  useEffect(() => {
    let cancelled = false;
    async function fetchDestinationData() {
      try {
        const res = await axios.get("/api/packages");
        if (cancelled) return;

        const names = [];
        const destMap = new Map();

        res.data.forEach((pkg) => {
          const dest = pkg.destination;
          if (!dest || typeof dest !== "object") return;

          const label = dest.name || dest.location;
          if (!label) return;

          names.push(label);

          if (!destMap.has(dest._id)) {
            destMap.set(dest._id, {
              id: dest._id,
              label,
              image: dest.images?.[0] || pkg.images?.[0] || null,
            });
          }
        });

        setLocationOptions([...new Set(names)]);
        setDestinationBrowseCards([...destMap.values()]);
      } catch {
        // Non-critical — dropdown/browse row just stay empty if this fails.
      }
    }
    fetchDestinationData();
    return () => {
      cancelled = true;
    };
  }, []);

  // Main fetch — re-runs whenever any filter changes, hitting the backend
  // with real query params instead of filtering client-side. Shows all
  // packages by default; selecting a destination just narrows the results.
  useEffect(() => {
    let cancelled = false;

    async function fetchPackages() {
      try {
        setLoading(true);
        const priceBand = PRICE_BANDS[priceBandIndex];
        const durationBand = DURATION_BANDS[durationBandIndex];

        const params = {};
        if (debouncedSearch) params.search = debouncedSearch;
        if (location) params.location = location;
        if (priceBand.min > 0) params.priceMin = priceBand.min;
        if (priceBand.max !== Infinity) params.priceMax = priceBand.max;
        if (durationBand.min > 0) params.durationMin = durationBand.min;
        if (durationBand.max !== Infinity) params.durationMax = durationBand.max;

        const res = await axios.get("/api/packages", { params });
        if (!cancelled) {
          setPackages(res.data);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) setError(err.message || "Failed to load packages");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchPackages();
    return () => {
      cancelled = true;
    };
  }, [debouncedSearch, location, priceBandIndex, durationBandIndex]);

  // Clicking a destination card sets (or clears, if already selected) the
  // location filter — reuses the exact same state the dropdown uses, so
  // they always stay in sync.
  const handleDestinationClick = (label) => {
    setLocation((prev) => (prev === label ? "" : label));
  };

  return (
    <main className="max-w-7xl mx-auto px-6 md:px-10 pt-32 pb-32">
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-[#F5F1E8] mb-1">
          Discover Destinations
        </h1>
        <p className="text-[#9A958A]">
          Browse curated packages and find your next journey.
        </p>
      </div>

      {/* ── Browse by destination ── */}
      {destinationBrowseCards.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-[#9A958A]">
              Browse by Destination
            </h2>
            {location && (
              <button
                onClick={() => setLocation("")}
                className="inline-flex items-center gap-1.5 text-xs"
              >
                <X size={14} />
                Clear selection
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {destinationBrowseCards.map((dest) => {
              const selected = location === dest.label;
              return (
                <button
                  key={dest.id}
                  onClick={() => handleDestinationClick(dest.label)}
                  className={`relative h-56 rounded-xl overflow-hidden border-2 transition-all ${
                    selected
                      ? "border-[#C9A227] ring-2 ring-[#C9A227]/40"
                      : "border-[#25252d] hover:border-[#C9A227]/40"
                  }`}
                >
                  <img
                    src={dest.image || "https://placehold.co/600x400/16161C/9A958A?text=Uncharted"}
                    alt={dest.label}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/10 to-transparent" />
                  <span className="absolute bottom-3 left-3 right-3 text-lg font-semibold text-white text-left">
                    {dest.label}
                  </span>
                  {selected && (
                    <span className="absolute top-3 right-3 bg-[#C9A227] text-[#0B0B0F] text-xs font-bold px-2.5 py-1 rounded-full">
                      Selected
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <FilterBar
        search={search}
        onSearchChange={setSearch}
        locations={locationOptions}
        location={location}
        onLocationChange={setLocation}
        priceBandIndex={priceBandIndex}
        onPriceBandChange={setPriceBandIndex}
        durationBandIndex={durationBandIndex}
        onDurationBandChange={setDurationBandIndex}
      />

      {loading && (
        <p className="text-[#9A958A] text-center py-16">Loading packages…</p>
      )}

      {error && (
        <p className="text-red-400 text-center py-16">
          Couldn't load packages: {error}
        </p>
      )}

      {!loading && !error && packages.length === 0 && (
        <p className="text-[#9A958A] text-center py-16">
          No packages match your filters. Try widening your search.
        </p>
      )}

      {!loading && !error && packages.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <DestinationCard key={pkg._id} pkg={pkg} />
          ))}
        </div>
      )}

      {compareList.length > 0 && (
        <Link
          to="/compare"
          className="fixed bottom-8 right-8 z-40 bg-[#C9A227] text-[#0B0B0F] px-6 py-3 rounded-full shadow-lg flex items-center gap-2 font-semibold hover:bg-[#E8C766] active:scale-95 transition-all"
        >
          <ArrowLeftRight size={18} />
          Compare ({compareList.length})
        </Link>
      )}
    </main>
  );
}