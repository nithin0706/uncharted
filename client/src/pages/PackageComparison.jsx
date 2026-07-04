import { useState, useEffect } from "react";
import "./PackageComparison.css";

// ─── Sample fallback data (used when backend is not available) ───────────────
const SAMPLE_PACKAGES = [
  {
    _id: "1",
    name: "Kerala Backwaters Escape",
    destination: "Kerala, India",
    duration: 5,
    price: 12999,
    rating: 4.5,
    inclusions: ["Hotel stay", "Houseboat cruise", "All meals", "Airport transfer"],
    image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=400&q=80",
  },
  {
    _id: "2",
    name: "Rajasthan Royal Tour",
    destination: "Rajasthan, India",
    duration: 7,
    price: 18500,
    rating: 4.8,
    inclusions: ["Heritage hotel", "Camel safari", "Breakfast", "Guide", "Airport transfer"],
    image: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=400&q=80",
  },
  {
    _id: "3",
    name: "Goa Beach Getaway",
    destination: "Goa, India",
    duration: 4,
    price: 9999,
    rating: 4.2,
    inclusions: ["Beach resort", "Breakfast", "Water sports", "Airport transfer"],
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=400&q=80",
  },
];

// ─── Helper to safely get a human-readable destination string ───────────────
// Handles both real API data (destination is a populated object: {_id, name, location})
// and sample fallback data (destination is a plain string).
function getDestinationLabel(destination) {
  if (!destination) return "";
  if (typeof destination === "string") return destination;
  return destination.name || destination.location || "";
}

// ─── Star renderer ────────────────────────────────────────────────────────────
function Stars({ rating }) {
  return (
    <span className="pc-stars">
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s} className={s <= Math.round(rating) ? "star filled" : "star"}>★</span>
      ))}
      <span className="pc-rating-num">{rating.toFixed(1)}</span>
    </span>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
const PackageComparison = () => {
  const [allPackages, setAllPackages] = useState([]);
  const [selected, setSelected] = useState([]); // max 3 package objects
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch packages from backend; fall back to sample data
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await fetch("/api/packages");
        if (!res.ok) throw new Error("Server error");
        const data = await res.json();
        setAllPackages(data);
      } catch {
        // Backend not available yet — use sample data so UI still works
        setAllPackages(SAMPLE_PACKAGES);
      } finally {
        setLoading(false);
      }
    };
    fetchPackages();
  }, []);

  // Toggle a package in/out of comparison (max 3)
  const toggleSelect = (pkg) => {
    setSelected((prev) => {
      const alreadyIn = prev.find((p) => p._id === pkg._id);
      if (alreadyIn) return prev.filter((p) => p._id !== pkg._id);
      if (prev.length >= 3) {
        setError("You can compare up to 3 packages at a time.");
        return prev;
      }
      setError("");
      return [...prev, pkg];
    });
  };

  const isSelected = (id) => selected.some((p) => p._id === id);

  // Comparison table rows
  const rows = [
    { label: "Destination", render: (p) => getDestinationLabel(p.destination) },
    { label: "Duration", render: (p) => `${p.duration} days` },
    { label: "Price", render: (p) => `₹${p.price.toLocaleString("en-IN")}` },
    { label: "Rating", render: (p) => <Stars rating={p.ratings ?? 0} /> },
    {
      label: "Inclusions",
      render: (p) => (
        <ul className="pc-inclusions-list">
          {p.inclusions.map((inc, i) => (
            <li key={i}>✓ {inc}</li>
          ))}
        </ul>
      ),
    },
  ];

  if (loading) return <div className="pc-loading">Loading packages…</div>;

  return (
    <div className="pc-page pt-32">
      {/* ── Header ── */}
      <div className="pc-header">
        <h1>Compare Packages</h1>
        <p className="pc-subtitle">
          Select up to <strong>3 packages</strong> to compare side-by-side.
        </p>
      </div>

      {/* ── Error banner ── */}
      {error && <div className="pc-error">{error}</div>}

      {/* ── Package selector cards ── */}
      <section className="pc-selector">
        <h2 className="pc-section-title">Choose Packages</h2>
        <div className="pc-cards-grid">
          {allPackages.map((pkg) => (
            <div
              key={pkg._id}
              className={`pc-card ${isSelected(pkg._id) ? "selected" : ""}`}
              onClick={() => toggleSelect(pkg)}
            >
              <img src={pkg.images?.[0]} alt={pkg.name} className="pc-card-img" />
              <div className="pc-card-body">
                <h3 className="pc-card-name">{pkg.name}</h3>
                <p className="pc-card-dest">📍 {getDestinationLabel(pkg.destination)}</p>
                <div className="pc-card-footer">
                  <span className="pc-card-price">₹{pkg.price.toLocaleString("en-IN")}</span>
                  <span className="pc-card-days">{pkg.duration} days</span>
                </div>
              </div>
              <div className="pc-card-badge">{isSelected(pkg._id) ? "✓ Selected" : "+ Compare"}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Comparison Table ── */}
      {selected.length >= 2 && (
        <section className="pc-table-section">
          <h2 className="pc-section-title">Side-by-Side Comparison</h2>
          <div className="pc-table-wrapper">
            <table className="pc-table">
              <thead>
                <tr>
                  <th className="pc-th-label">Feature</th>
                  {selected.map((pkg) => (
                    <th key={pkg._id} className="pc-th-pkg">
                      <img src={pkg.images?.[0]} alt={pkg.name} className="pc-th-img" />
                      <span>{pkg.name}</span>
                      <button
                        className="pc-remove-btn"
                        onClick={() => toggleSelect(pkg)}
                        title="Remove"
                      >
                        ✕
                      </button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.label}>
                    <td className="pc-td-label">{row.label}</td>
                    {selected.map((pkg) => (
                      <td key={pkg._id} className="pc-td-val">
                        {row.render(pkg)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {selected.length === 1 && (
        <p className="pc-hint">Select one more package to start comparing.</p>
      )}
    </div>
  );
};

export default PackageComparison;
