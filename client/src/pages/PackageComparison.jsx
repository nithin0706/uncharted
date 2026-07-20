// client/src/pages/PackageComparison.jsx
import { useState, useEffect, Fragment } from "react";
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
    reviewCount: 12,
    inclusions: [
      "Hotel stay",
      "Houseboat cruise",
      "All meals",
      "Airport transfer",
    ],
    exclusions: ["Flight tickets", "Travel insurance"],
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
    reviewCount: 20,
    inclusions: [
      "Heritage hotel",
      "Camel safari",
      "Breakfast",
      "Guide",
      "Airport transfer",
    ],
    exclusions: ["Flight tickets", "Lunch"],
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
    reviewCount: 8,
    inclusions: [
      "Beach resort",
      "Breakfast",
      "Water sports",
      "Airport transfer",
    ],
    exclusions: ["Flight tickets", "Dinner"],
    image:
      "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=400&q=80",
  },
];

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

  function getPrimaryBadge(pkg) {
    if (selected.length >= 2 && pkg.price === lowestPrice) {
      return { label: "Best Value", tone: "green", icon: "🏅" };
    }

    if (selected.length >= 2 && pkg.ratings === highestRating) {
      return { label: "Highest Rated", tone: "gold", icon: "🏆" };
    }

    return null;
  }

  const recommendedPkg =
    selected.length >= 2 ? selected.find((p) => p.price === lowestPrice) : null;

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
      icon: "₹",
      render: (p) => (
        <span style={p.price === lowestPrice ? { color: "var(--pc-green)", fontWeight: 700 } : undefined}>
          ₹{p.price.toLocaleString("en-IN")}
        </span>
      ),
    },
    {
      label: "Rating",
      icon: "⭐",
      render: (p) => (
        <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Stars rating={p.ratings || 0} />
          <span className="pc-rating-num">
            {(p.ratings || 0).toFixed(1)} ({p.reviewCount ?? 0} reviews)
          </span>
        </span>
      ),
    },
    {
      label: "Inclusions",
      icon: "✅",
      render: (p) => (
        <ul className="pc-check-list">
          {(p.inclusions || []).map((inc, i) => (
            <li key={i}>
              <span className="pc-check-icon">✓</span> {inc}
            </li>
          ))}
        </ul>
      ),
    },
    {
      label: "Exclusions",
      icon: "❌",
      render: (p) => (
        <ul className="pc-check-list">
          {(p.exclusions || []).map((exc, i) => (
            <li key={i}>
              <span className="pc-x-icon">✕</span> {exc}
            </li>
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
      <div className="pc-container">
        <div className="pc-hero-banner">
          <div className="pc-hero-left">
            <span className="pc-hero-icon">⚖️</span>
            <div>
              <h1 className="pc-hero-title">Compare Packages</h1>
              <p className="pc-hero-subtitle">
                Select up to 3 packages to compare price, rating, duration
                and what's included.
              </p>
            </div>
          </div>
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
          <div className="pc-compare-wrap">
            <div
              className="pc-compare-grid"
              style={{ "--cols": selected.length }}
            >
              <div className="pc-feat-header">
                <span className="pc-feat-header-label">Features</span>
                <span className="pc-feat-divider">— ◇ —</span>
              </div>

              {selected.map((pkg) => {
                const badge = getPrimaryBadge(pkg);

                return (
                  <div key={pkg._id} className="pc-pkg-cell">
                    <img
                      src={pkg.images?.[0] || pkg.image}
                      alt={pkg.name}
                      className="pc-pkg-cell-img"
                    />
                    <div className="pc-pkg-cell-overlay" />

                    <button
                      className="pc-pkg-cell-remove"
                      onClick={() => toggleSelect(pkg)}
                      aria-label={`Remove ${pkg.name}`}
                    >
                      ✕
                    </button>

                    <div className="pc-pkg-cell-content">
                      <h3 className="pc-pkg-cell-name">{pkg.name}</h3>
                      <p className="pc-pkg-cell-loc">
                        📍 {getDestinationLabel(pkg.destination)}
                      </p>

                      {badge ? (
                        <span className={`pc-pill pc-pill-${badge.tone}`}>
                          {badge.icon} {badge.label}
                        </span>
                      ) : (
                        <span className="pc-pill pc-pill-gold">
                          ⭐ {(pkg.ratings || 0).toFixed(1)} (
                          {pkg.reviewCount ?? 0} reviews)
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}

              {rows.map((row) => (
                <Fragment key={row.label}>
                  <div className="pc-feat-label">
                    <span className="pc-feat-icon">{row.icon}</span>
                    {row.label}
                  </div>

                  {selected.map((pkg) => (
                    <div key={`${row.label}-${pkg._id}`} className="pc-feat-value">
                      {row.render(pkg)}
                    </div>
                  ))}
                </Fragment>
              ))}
            </div>

            {recommendedPkg && (
              <div className="pc-recommend-bar">
                <div className="pc-recommend-item">
                  <span className="pc-recommend-icon gold">🏅</span>
                  <div>
                    <p className="pc-recommend-title gold">Our Recommendation</p>
                    <p className="pc-recommend-sub">
                      Based on price, inclusions and overall value
                    </p>
                  </div>
                </div>

                <div className="pc-recommend-item">
                  <span className="pc-recommend-icon green">⭐</span>
                  <div>
                    <p className="pc-recommend-title green">
                      {recommendedPkg.name}
                    </p>
                    <p className="pc-recommend-sub">
                      Best value for money at ₹
                      {recommendedPkg.price.toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {selected.length === 1 && (
          <p className="pc-hint">Select one more package to start comparing.</p>
        )}
      </div>
    </div>
  );
};

export default PackageComparison;
