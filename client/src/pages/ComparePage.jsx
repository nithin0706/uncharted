import { useState, useEffect } from "react";
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
      <span className="pc-rating-num">{safeRating.toFixed(1)}</span>
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

  const longestDuration = packages.length
    ? Math.max(...packages.map((p) => p.duration))
    : null;

  const cheapestPkg = packages.find((p) => p.price === lowestPrice);
  const topRatedPkg = ratedPackages.find((p) => p.avgRating === highestRating);
  const longestPkg = packages.find((p) => p.duration === longestDuration);

  function getBadges(pkg) {
    const badges = [];

    if (packages.length >= 2 && pkg.price === lowestPrice) {
      badges.push({ label: "Best value", key: "value", tone: "green" });
    }

    if (
      highestRating !== null &&
      pkg.avgRating === highestRating &&
      (pkg.reviewCount ?? 0) > 0
    ) {
      badges.push({ label: "Highest rated", key: "rated", tone: "gold" });
    }

    if (packages.length >= 2 && pkg.duration === longestDuration) {
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
          {p.price === lowestPrice && packages.length >= 2 && (
            <span className="pc-badge">Best value</span>
          )}
        </span>
      ),
    },
    {
      label: "Rating",
      icon: "⭐",
      render: (p) => <Stars rating={p.avgRating} />,
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
    {
      label: "Exclusions",
      icon: "❌",
      render: (p) => (
        <ul className="pc-inclusions-list pc-exclusions-list">
          {(p.exclusions || []).map((exc, i) => (
            <li key={i}>✕ {exc}</li>
          ))}
        </ul>
      ),
    },
  ];

  return (
    <div className="pc-page pt-32">
      <div className="pc-header">
        <span className="pc-eyebrow">Uncharted / Compare</span>
        <h1>Compare packages</h1>

        <p className="pc-subtitle">
          {compareList.length > 0
            ? `Comparing ${compareList.length} package${
                compareList.length > 1 ? "s" : ""
              } side by side — price, rating, duration and what's included.`
            : "Add packages to compare from the destinations page."}
        </p>

        {compareList.length > 0 && (
          <button className="pc-clear-all-btn" onClick={clearCompare}>
            Clear all
          </button>
        )}
      </div>

      {error && <div className="pc-error">{error}</div>}

      {loading && <div className="pc-loading">Loading comparison…</div>}

      {!loading && compareList.length === 0 && (
        <p className="pc-hint">No packages selected.</p>
      )}

      {!loading && packages.length >= 2 && (
        <>
          <div className="pc-strip">
            {packages.map((pkg, i) => (
              <div
                key={pkg._id}
                className="pc-strip-card"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <div className="pc-strip-img-wrap">
                  <img
                    src={pkg.images?.[0]}
                    alt={pkg.name}
                    className="pc-strip-img"
                  />
                  <div className="pc-strip-img-overlay" />
                  <button
                    className="pc-strip-remove"
                    onClick={() => removeFromCompare(pkg._id)}
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
                    {topRatedPkg.avgRating.toFixed(1)} rating
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

                    {packages.map((pkg) => (
                      <th key={pkg._id} className="pc-th-pkg">
                        <img
                          src={pkg.images?.[0]}
                          alt={pkg.name}
                          className="pc-th-img"
                        />

                        <span>{pkg.name}</span>

                        <button
                          className="pc-remove-btn"
                          onClick={() => removeFromCompare(pkg._id)}
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
        </>
      )}
    </div>
  );
};

export default ComparePage;
