import { useState, useEffect, Fragment } from "react";
import { useCompare } from "../context/CompareContext";
import "./PackageComparison.css";

function getDestinationLabel(destination) {
  if (!destination) return "";
  if (typeof destination === "string") return destination;
  return destination.name || destination.location || "";
}

function Stars({ rating }) {
  const safeRating = rating ?? 0;

  return (
    <span className="pc-stars">
      {[1, 2, 3, 4, 5].map((s) => (
        <span
          key={s}
          className={s <= Math.round(safeRating) ? "star filled" : "star"}
        >
          ★
        </span>
      ))}
    </span>
  );
}

const ComparePage = () => {
  const { compareList, removeFromCompare, clearCompare } = useCompare();

  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (compareList.length === 0) {
      setPackages([]);
      setLoading(false);
      return;
    }

    const fetchComparePackages = async () => {
      setLoading(true);
      setError("");

      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/packages/compare?ids=${compareList.join(",")}`
        );

        if (!res.ok) {
          throw new Error("Failed to load comparison data");
        }

        const data = await res.json();

        setPackages(data);
      } catch (err) {
        console.error(err);
        setError("Couldn't load packages for comparison.");
      } finally {
        setLoading(false);
      }
    };

    fetchComparePackages();
  }, [compareList]);

  const lowestPrice = packages.length
    ? Math.min(...packages.map((p) => p.price))
    : null;

  const ratedPackages = packages.filter((p) => (p.reviewCount ?? 0) > 0);

  const highestRating = ratedPackages.length
    ? Math.max(...ratedPackages.map((p) => p.avgRating))
    : null;

  // Primary badge shown on each package's image header (best value beats highest rated)
  function getPrimaryBadge(pkg) {
    if (packages.length >= 2 && pkg.price === lowestPrice) {
      return { label: "Best Value", tone: "green", icon: "🏅" };
    }

    if (
      highestRating !== null &&
      pkg.avgRating === highestRating &&
      (pkg.reviewCount ?? 0) > 0
    ) {
      return { label: "Highest Rated", tone: "gold", icon: "🏆" };
    }

    return null;
  }

  // Package recommended in the footer bar: cheapest package overall
  const recommendedPkg =
    packages.length >= 2
      ? packages.find((p) => p.price === lowestPrice)
      : null;

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
          <Stars rating={p.avgRating} />
          <span className="pc-rating-num">
            {(p.avgRating ?? 0).toFixed(1)} ({p.reviewCount ?? 0} reviews)
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

  // Highlights row is only shown if at least one package actually has a description/highlight
  const hasHighlights = packages.some((p) => p.highlights || p.description);

  if (hasHighlights) {
    rows.push({
      label: "Highlights",
      icon: "✨",
      render: (p) => (
        <div className="pc-highlight-box">
          <span className="pc-highlight-icon">✨</span>
          <span>{p.highlights || p.description}</span>
        </div>
      ),
    });
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
                Find the perfect package that matches your travel style and
                budget.
              </p>
              {compareList.length > 0 && (
                <span className="pc-hero-meta">
                  <span className="pc-hero-meta-dot" />
                  Comparing {compareList.length} package
                  {compareList.length > 1 ? "s" : ""}
                </span>
              )}
            </div>
          </div>

          {compareList.length > 0 && (
            <button className="pc-hero-clear-btn" onClick={clearCompare}>
              🗑 Clear All
            </button>
          )}
        </div>

        {error && <div className="pc-error">{error}</div>}

        {loading && <div className="pc-loading">Loading comparison…</div>}

        {!loading && compareList.length === 0 && (
          <p className="pc-hint">No packages selected.</p>
        )}

        {!loading && packages.length >= 2 && (
          <div className="pc-compare-wrap">
            <div
              className="pc-compare-grid"
              style={{ "--cols": packages.length }}
            >
              <div className="pc-feat-header">
                <span className="pc-feat-header-label">Features</span>
                <span className="pc-feat-divider">— ◇ —</span>
              </div>

              {packages.map((pkg) => {
                const badge = getPrimaryBadge(pkg);

                return (
                  <div key={pkg._id} className="pc-pkg-cell">
                    <img
                      src={pkg.images?.[0]}
                      alt={pkg.name}
                      className="pc-pkg-cell-img"
                    />
                    <div className="pc-pkg-cell-overlay" />

                    <button
                      className="pc-pkg-cell-remove"
                      onClick={() => removeFromCompare(pkg._id)}
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
                          ⭐ {(pkg.avgRating ?? 0).toFixed(1)} (
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

                  {packages.map((pkg) => (
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

                <a href="/destinations" className="pc-recommend-cta">
                  View Packages →
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ComparePage;
