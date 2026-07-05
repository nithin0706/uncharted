import { Search, MapPin, IndianRupee, Clock } from "lucide-react";

const PRICE_BANDS = [
  { label: "Any Price", min: 0, max: Infinity },
  { label: "Under ₹10,000", min: 0, max: 10000 },
  { label: "₹10,000 - ₹20,000", min: 10000, max: 20000 },
  { label: "₹20,000+", min: 20000, max: Infinity },
];

const DURATION_BANDS = [
  { label: "Any Duration", min: 0, max: Infinity },
  { label: "1-4 Days", min: 1, max: 4 },
  { label: "5-7 Days", min: 5, max: 7 },
  { label: "8+ Days", min: 8, max: Infinity },
];

export default function FilterBar({
  search,
  onSearchChange,
  locations,
  location,
  onLocationChange,
  priceBandIndex,
  onPriceBandChange,
  durationBandIndex,
  onDurationBandChange,
}) {
  return (
    <div className="space-y-4 mb-10">
      <div className="relative max-w-2xl">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9A958A] pointer-events-none"
        />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search destinations, packages..."
          style={{ paddingLeft: "44px" }}
          className="w-full pr-4 py-3.5 rounded-full"
        />
      </div>

      <div className="flex items-center gap-3 overflow-x-auto pb-2">
        <div className="flex items-center gap-2 bg-[#16161C] border border-[#25252d] rounded-full pl-3 pr-2 py-1.5 whitespace-nowrap">
          <MapPin size={16} className="text-[#C9A227]" />
          <select
            value={location}
            onChange={(e) => onLocationChange(e.target.value)}
            className="bg-transparent border-none p-0 text-sm text-[#F5F1E8] focus:ring-0"
          >
            <option value="">All Locations</option>
            {locations.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 bg-[#16161C] border border-[#25252d] rounded-full pl-3 pr-2 py-1.5 whitespace-nowrap">
          <IndianRupee size={16} className="text-[#C9A227]" />
          <select
            value={priceBandIndex}
            onChange={(e) => onPriceBandChange(Number(e.target.value))}
            className="bg-transparent border-none p-0 text-sm text-[#F5F1E8] focus:ring-0"
          >
            {PRICE_BANDS.map((band, i) => (
              <option key={band.label} value={i}>
                {band.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 bg-[#16161C] border border-[#25252d] rounded-full pl-3 pr-2 py-1.5 whitespace-nowrap">
          <Clock size={16} className="text-[#C9A227]" />
          <select
            value={durationBandIndex}
            onChange={(e) => onDurationBandChange(Number(e.target.value))}
            className="bg-transparent border-none p-0 text-sm text-[#F5F1E8] focus:ring-0"
          >
            {DURATION_BANDS.map((band, i) => (
              <option key={band.label} value={i}>
                {band.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

export { PRICE_BANDS, DURATION_BANDS };
