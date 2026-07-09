import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeftRight } from "lucide-react";
import axios from "axios";
import { useCompare } from "../context/CompareContext";
import DestinationCard from "../components/DestinationCard";
import FilterBar, { PRICE_BANDS, DURATION_BANDS } from "../components/FilterBar";

const SEARCH_DEBOUNCE_MS = 350;

export default function DestinationsPage() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [locationOptions, setLocationOptions] = useState([]);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [location, setLocation] = useState("");
  const [priceBandIndex, setPriceBandIndex] = useState(0);
  const [durationBandIndex, setDurationBandIndex] = useState(0);

  const { compareList } = useCompare();

  useEffect(() => {
    const handle = setTimeout(() => setDebouncedSearch(search), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(handle);
  }, [search]);

  // Unfiltered fetch just to populate the location dropdown
  useEffect(() => {
    let cancelled = false;
    async function fetchLocationOptions() {
      try {
        const res = await axios.get(
  `${import.meta.env.VITE_NITHIN_API_URL}/api/packages`
);
        if (cancelled) return;

        const names = [];
        res.data.forEach((pkg) => {
          const dest = pkg.destination;
          if (!dest || typeof dest !== "object") return;
          const label = dest.name || dest.location;
          if (label) names.push(label);
        });

        setLocationOptions([...new Set(names)]);
      } catch {}
    }
    fetchLocationOptions();
    return () => { cancelled = true; };
  }, []);

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

       const res = await axios.get(
  `${import.meta.env.VITE_NITHIN_API_URL}/api/packages`,
  { params }
);
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
    return () => { cancelled = true; };
  }, [debouncedSearch, location, priceBandIndex, durationBandIndex]);

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
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