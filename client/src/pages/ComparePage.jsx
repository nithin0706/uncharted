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

        console.log("Compare Response:", data);

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

  const ratedPackages = packages.filter(
    (p) => (p.reviewCount ?? 0) > 0
  );

  const highestRating = ratedPackages.length
    ? Math.max(...ratedPackages.map((p) => p.avgRating))
    : null;

  function getBadges(pkg) {
    const badges = [];

    if (packages.length >= 2 && pkg.price === lowestPrice) {
      badges.push({ label: "💰 Best Value", key: "value" });
    }

    if (
      highestRating !== null &&
      pkg.avgRating === highestRating &&
      (pkg.reviewCount ?? 0) > 0
    ) {
      badges.push({ label: "⭐ Highest Rated", key: "rated" });
    }

    return badges;
  }

  const rows = [
    {
      label: "Destination",
      render: (p) => getDestinationLabel(p.destination),
    },
    {
      label: "Duration",
      render: (p) => `${p.duration} days`,
    },
    {
      label: "Price",
      render: (p) => `₹${p.price.toLocaleString("en-IN")}`,
    },
    {
      label: "Rating",
      render: (p) => <Stars rating={p.avgRating} />,
    },
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
      <div className="pc-header">
        <h1>Compare Packages</h1>

        <p className="pc-subtitle">
          {compareList.length > 0
            ? `Comparing ${compareList.length} package${
                compareList.length > 1 ? "s" : ""
              }.`
            : "Add packages to compare from the destinations page."}
        </p>

        {compareList.length > 0 && (
          <button className="pc-clear-all-btn" onClick={clearCompare}>
            Clear all
          </button>
        )}
      </div>

      {error && <div className="pc-error">{error}</div>}

      {loading && <div className="pc-loading">Loading comparison...</div>}

      {!loading && compareList.length === 0 && (
        <p className="pc-hint">No packages selected.</p>
      )}

      {!loading && packages.length >= 2 && (
        <section className="pc-table-section">
          <div className="pc-table-wrapper">
            <table className="pc-table">
              <thead>
                <tr>
                  <th>Feature</th>

                  {packages.map((pkg) => (
                    <th key={pkg._id}>
                      <img
                        src={pkg.images?.[0]}
                        alt={pkg.name}
                        className="pc-th-img"
                      />

                      <div>{pkg.name}</div>

                      {getBadges(pkg).map((badge) => (
                        <div key={badge.key}>{badge.label}</div>
                      ))}

                      <button onClick={() => removeFromCompare(pkg._id)}>
                        ✕
                      </button>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {rows.map((row) => (
                  <tr key={row.label}>
                    <td>{row.label}</td>

                    {packages.map((pkg) => (
                      <td key={pkg._id}>{row.render(pkg)}</td>
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