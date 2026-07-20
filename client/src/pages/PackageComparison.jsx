// client/src/pages/PackageComparison.jsx
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
    ratings: 4.5,
    inclusions: [
      "Hotel stay",
      "Houseboat cruise",
      "All meals",
      "Airport transfer",
    ],
    image:
      "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=400&q=80",
  },
  {
    _id: "2",
    name: "Rajasthan Royal Tour",
    destination: "Rajasthan, India",
    duration: 7,
    price: 18500,
    ratings: 4.8,
    inclusions: [
      "Heritage hotel",
      "Camel safari",
      "Breakfast",
      "Guide",
      "Airport transfer",
    ],
    image:
      "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=400&q=80",
  },
  {
    _id: "3",
    name: "Goa Beach Getaway",
    destination: "Goa, India",
    duration: 4,
    price: 9999,
    ratings: 4.2,
    inclusions: [
      "Beach resort",
      "Breakfast",
      "Water sports",
      "Airport transfer",
    ],
    image:
      "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=400&q=80",
  },
];

// Helper to safely get destination name
function getDestinationLabel(destination) {
  if (!destination) return "";
  if (typeof destination === "string") return destination;
  return destination.name || destination.location || "";
}

function Stars({ rating }) {
  return (
    <span className="pc-stars">
      {[1, 2, 3, 4, 5].map((s) => (
        <span
          key={s}
          className={s <= Math.round(rating) ? "star filled" : "star"}
        >
          ★
        </span>
      ))}
      <span className="pc-rating-num">{rating.toFixed(1)}</span>
    </span>
  );
}

const PackageComparison = () => {
  const [allPackages, setAllPackages] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/packages`);
        if (!res.ok) throw new Error("Server error");

        const data = await res.json();
        setAllPackages(data);
      } catch (err) {
        console.error(err);
        setError("Could not load packages.");
        setAllPackages(SAMPLE_PACKAGES);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  const toggleSelect = (pkg) => {
    setSelected((prev) => {
      const already = prev.find((p) => p._id === pkg._id);

      if (already) {
        return prev.filter((p) => p._id !== pkg._id);
      }

      if (prev.length >= 3) {
        setError("You can compare up to 3 packages at a time.");
        return prev;
      }

      setError("");
      return [...prev, pkg];
    });
  };

  const isSelected = (id) => selected.some((pkg) => pkg._id === id);

  const lowestPrice =
    selected.length > 0 ? Math.min(...selected.map((p) => p.price)) : null;

  const highestRating =
    selected.length > 0
      ? Math.max(...selected.map((p) => p.ratings || 0))
      : null;

  const longestDuration =
    selected.length > 0
      ? Math.max(...selected.map((p) => p.duration))
      : null;

  const cheapestPkg = selected.find((p) => p.price === lowestPrice);
  const topRatedPkg = selected.find((p) => p.ratings === highestRating);
  const longestPkg = selected.find((p) => p.duration === longestDuration);

  function getBadges(pkg) {
    const badges = [];

    if (selected.length >= 2 && pkg.price === lowestPrice) {
      badges.push({ label: "Best value", key: "value", tone: "green" });
    }

    if (selected.length >= 2 && pkg.ratings === highestRating) {
      badges.push({ label: "Highest rated", key: "rated", tone: "gold" });
    }

    if (selected.length >= 2 && pkg.duration === longestDuration) {
      badges.push({ label: "Longest trip", key: "longest", tone: "blue" });
    }

    return badges;
  }

  const rows = [
    {
      label: "Destination",
      icon: "📍",
      render: (p) => getDestinationLabel(p.destination),
    },
    {
      label: "Duration",
      icon: "🕒",
      render: (p) => `${p.duration} days`,
    },
    {
      label: "Price",
      icon: "💰",
      render: (p) => (
        <span className={p.price === lowestPrice ? "pc-best-value" : ""}>
          ₹{p.price.toLocaleString("en-IN")}
          {p.price === lowestPrice && selected.length >= 2 && (
            <span className="pc-badge">Best value</span>
          )}
        </span>
      ),
    },
    {
      label: "Rating",
      icon: "⭐",
      render: (p) => (
        <span className={p.ratings === highestRating ? "pc-best-value" : ""}>
          <Stars rating={p.ratings || 0} />
          {p.ratings === highestRating && selected.length >= 2 && (
            <span className="pc-badge">Highest rated</span>
          )}
        </span>
      ),
    },
    {
      label: "Inclusions",
      icon: "✅",
      render: (p) => (
        <ul className="pc-inclusions-list">
          {(p.inclusions || []).map((inc, i) => (
            <li key={i}>✓ {inc}</li>
          ))}
        </ul>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="pc-page pt-32">
        <div className="pc-loading">Loading packages…</div>
      </div>
    );
  }

  return (
    <div className="pc-page pt-32">
      <div className="pc-header">
        <span className="pc-eyebrow">Uncharted / Compare</span>
        <h1>Compare packages</h1>
        <p className="pc-subtitle">
          Select up to <strong>3 packages</strong> to compare price, rating,
          duration and what's included, side by side.
        </p>
      </div>

      {error && <div className="pc-error">{error}</div>}

      <section className="pc-selector">
        <h2 className="pc-section-title">Choose packages</h2>

        <div className="pc-cards-grid">
          {allPackages.map((pkg) => (
            <div
              key={pkg._id}
              className={`pc-card ${isSelected(pkg._id) ? "selected" : ""}`}
              onClick={() => toggleSelect(pkg)}
            >
              <img
                src={pkg.images?.[0] || pkg.image}
                alt={pkg.name}
                className="pc-card-img"
              />

              <div className="pc-card-body">
                <h3 className="pc-card-name">{pkg.name}</h3>

                <p className="pc-card-dest">
                  📍 {getDestinationLabel(pkg.destination)}
                </p>

                <div className="pc-card-footer">
                  <span className="pc-card-price">
                    ₹{pkg.price.toLocaleString("en-IN")}
                  </span>

                  <span className="pc-card-days">{pkg.duration} days</span>
                </div>
              </div>

              <div className="pc-card-badge">
                {isSelected(pkg._id) ? "✓ Selected" : "+ Compare"}
              </div>
            </div>
          ))}
        </div>
      </section>

      {selected.length >= 2 && (
        <>
          <div className="pc-strip">
            {selected.map((pkg, i) => (
              <div
                key={pkg._id}
                className="pc-strip-card"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <div className="pc-strip-img-wrap">
                  <img
                    src={pkg.images?.[0] || pkg.image}
                    alt={pkg.name}
                    className="pc-strip-img"
                  />
                  <div className="pc-strip-img-overlay" />
                  <button
                    className="pc-strip-remove"
                    onClick={() => toggleSelect(pkg)}
                  >
                    ✕ Remove
                  </button>
                </div>

                <div className="pc-strip-body">
                  <h3 className="pc-strip-name">{pkg.name}</h3>
                  <p className="pc-strip-meta">
                    📍 {getDestinationLabel(pkg.destination)}
                  </p>

                  <div className="pc-strip-footer">
                    <span className="pc-strip-price">
                      ₹{pkg.price.toLocaleString("en-IN")}
                    </span>
                    <span className="pc-strip-days">{pkg.duration} days</span>
                  </div>

                  <div className="pc-strip-badges">
                    {getBadges(pkg).map((badge) => (
                      <span
                        key={badge.key}
                        className={`pc-pill pc-pill-${badge.tone}`}
                      >
                        {badge.label}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="pc-stats">
            {cheapestPkg && (
              <div className="pc-stat-card">
                <span className="pc-stat-icon green">💰</span>
                <div>
                  <p className="pc-stat-label">Cheapest</p>
                  <p className="pc-stat-value">{cheapestPkg.name}</p>
                  <p className="pc-stat-sub">
                    ₹{cheapestPkg.price.toLocaleString("en-IN")}
                  </p>
                </div>
              </div>
            )}

            {topRatedPkg && (
              <div className="pc-stat-card">
                <span className="pc-stat-icon gold">⭐</span>
                <div>
                  <p className="pc-stat-label">Highest rated</p>
                  <p className="pc-stat-value">{topRatedPkg.name}</p>
                  <p className="pc-stat-sub">
                    {(topRatedPkg.ratings || 0).toFixed(1)} rating
                  </p>
                </div>
              </div>
            )}

            {longestPkg && (
              <div className="pc-stat-card">
                <span className="pc-stat-icon blue">🕒</span>
                <div>
                  <p className="pc-stat-label">Longest trip</p>
                  <p className="pc-stat-value">{longestPkg.name}</p>
                  <p className="pc-stat-sub">{longestPkg.duration} days</p>
                </div>
              </div>
            )}
          </div>

          <section className="pc-table-section">
            <div className="pc-table-wrapper">
              <table className="pc-table">
                <thead>
                  <tr>
                    <th className="pc-th-label">Feature</th>

                    {selected.map((pkg) => (
                      <th key={pkg._id} className="pc-th-pkg">
                        <img
                          src={pkg.images?.[0] || pkg.image}
                          alt={pkg.name}
                          className="pc-th-img"
                        />

                        <span>{pkg.name}</span>

                        <button
                          className="pc-remove-btn"
                          onClick={() => toggleSelect(pkg)}
                        >
                          ✕ Remove
                        </button>
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {rows.map((row) => (
                    <tr key={row.label}>
                      <td className="pc-td-label">
                        <span className="pc-row-icon">{row.icon}</span>
                        {row.label}
                      </td>

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
        </>
      )}

      {selected.length === 1 && (
        <p className="pc-hint">Select one more package to start comparing.</p>
      )}
    </div>
  );
};

export default PackageComparison;
