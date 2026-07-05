import { useState, useEffect } from "react";
import { useCompare } from "../context/CompareContext";
import "./PackageComparison.css"; // reusing existing pc- styles for visual consistency

// ─── Helper to safely get a human-readable destination string ───────────────
// destination comes populated from backend as {_id, name, location}
function getDestinationLabel(destination) {
  if (!destination) return "";
  if (typeof destination === "string") return destination;
  return destination.name || destination.location || "";
}

// ─── Star renderer ────────────────────────────────────────────────────────────
function Stars({ rating }) {
  const safeRating = rating ?? 0;
  return (
    <span className="pc-stars">
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s} className={s <= Math.round(safeRating) ? "star filled" : "star"}>★</span>
      ))}
      <span className="pc-rating-num">{safeRating.toFixed(1)}</span>
    </span>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
const ComparePage = () => {
  const { compareList, removeFromCompare, clearCompare } = useCompare();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Nothing selected — skip the fetch entirely
    if (compareList.length === 0) {
      setPackages([]);
      setLoading(false);
      return;
    }

    const fetchComparePackages = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`/api/packages/compare?ids=${compareList.join(",")}`);
        if (!res.ok) throw new Error("Failed to load comparison data");
        const data = await res.json();
        setPackages(data);
      } catch (err) {
        setError("Couldn't load packages for comparison. Please try again.");
        setPackages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchComparePackages();
  }, [compareList]);

  // ── Compute badges: cheapest price = "Best Value", highest avgRating (with
  // at least one review) = "Highest Rated". Only shown when there's an
  // actual distinction to make (2+ packages, and for rating, someone
  // actually has reviews).
  const lowestPrice = packages.length ? Math.min(...packages.map((p) => p.price)) : null;
  const ratedPackages = packages.filter((p) => (p.reviewCount ?? 0) > 0);
  const highestRating = ratedPackages.length ? Math.max(...ratedPackages.map((p) => p.avgRating)) : null;

  function getBadges(pkg) {
    const badges = [];
    if (packages.length >= 2 && pkg.price === lowestPrice) {
      badges.push({ label: "💰 Best Value", key: "value" });
    }
    if (highestRating !== null && pkg.avgRating === highestRating && (pkg.reviewCount ?? 0) > 0) {
      badges.push({ label: "⭐ Highest Rated", key: "rated" });
    }
    return badges;
  }

  // Comparison table rows
  const rows = [
    { label: "Destination", render: (p) => getDestinationLabel(p.destination) },
    { label: "Duration", render: (p) => `${p.duration} days` },
    { label: "Price", render: (p) => `₹${p.price.toLocaleString("en-IN")}` },
    { label: "Rating", render: (p) => <Stars rating={p.avgRating} /> },
    {
      label: "Inclusions",
      render: (p) => (
        <ul className="pc-inclusions-list">
          {(p.inclusions || []).map((inc, i) => (
            <li key={i}>✓ {inc}</li>
          ))}
        </ul>
      ),
    },
    {
      label: "Exclusions",
      render: (p) => (
        <ul className="pc-inclusions-list">
          {(p.exclusions || []).map((exc, i) => (
            <li key={i}>✕ {exc}</li>
          ))}
        </ul>
      ),
    },
  ];

  return (
    <div className="pc-page pt-32">
      {/* ── Header ── */}
      <div className="pc-header">
        <h1>Compare Packages</h1>
        <p className="pc-subtitle">
          {compareList.length > 0
            ? `Comparing ${compareList.length} package${compareList.length > 1 ? "s" : ""}.`
            : "Add packages to compare from the destinations page."}
        </p>
        {compareList.length > 0 && (
          <button className="pc-remove-btn" onClick={clearCompare} style={{ marginTop: "8px" }}>
            Clear all
          </button>
        )}
      </div>

      {error && <div className="pc-error">{error}</div>}

      {loading && <div className="pc-loading">Loading comparison…</div>}

      {!loading && compareList.length === 0 && (
        <p className="pc-hint">
          You haven't added any packages to compare yet. Go to Destinations and tap "Compare" on
          the packages you're interested in.
        </p>
      )}

      {!loading && compareList.length === 1 && (
        <p className="pc-hint">Add at least one more package to see a comparison.</p>
      )}

      {!loading && packages.length >= 2 && (
        <section className="pc-table-section">
          <h2 className="pc-section-title">Side-by-Side Comparison</h2>
          <div className="pc-table-wrapper">
            <table className="pc-table">
              <thead>
                <tr>
                  <th className="pc-th-label">Feature</th>
                  {packages.map((pkg) => (
                    <th key={pkg._id} className="pc-th-pkg">
                      <img src={pkg.images?.[0]} alt={pkg.name} className="pc-th-img" />
                      <span>{pkg.name}</span>
                      {getBadges(pkg).length > 0 && (
                        <div style={{ display: "flex", flexDirection: "column", gap: "4px", marginTop: "6px" }}>
                          {getBadges(pkg).map((badge) => (
                            <span
                              key={badge.key}
                              style={{
                                fontSize: "11px",
                                fontWeight: 600,
                                padding: "2px 8px",
                                borderRadius: "999px",
                                background: "rgba(201, 162, 39, 0.15)",
                                color: "#C9A227",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {badge.label}
                            </span>
                          ))}
                        </div>
                      )}
                      <button
                        className="pc-remove-btn"
                        onClick={() => removeFromCompare(pkg._id)}
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
                    {packages.map((pkg) => (
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
    </div>
  );
};

export default ComparePage;
