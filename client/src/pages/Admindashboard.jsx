import { useEffect, useState } from "react";
import axios from "axios";
import "./Admindashboard.css";

const API_BASE = `${import.meta.env.VITE_API_URL}/api/admin`;
const PACKAGES_API_BASE = `${import.meta.env.VITE_API_URL}/api/packages`;
const DESTINATIONS_API_BASE = `${import.meta.env.VITE_API_URL}/api/destinations`;

function getApi() {
  const token = localStorage.getItem("token");
  return axios.create({
    baseURL: API_BASE,
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  });
}

function getPackagesApi() {
  const token = localStorage.getItem("token");
  return axios.create({
    baseURL: PACKAGES_API_BASE,
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  });
}

function getDestinationsApi() {
  const token = localStorage.getItem("token");
  return axios.create({
    baseURL: DESTINATIONS_API_BASE,
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  });
}

const EMPTY_PACKAGE_FORM = {
  name: "",
  destination: "",
  duration: "",
  price: "",
  itinerary: "",       // one line per day, joined into an array on submit
  inclusions: "",       // comma-separated
  exclusions: "",       // comma-separated
  images: "",           // comma-separated URLs
  travelStart: "",
  travelEnd: "",
};

function AdminDashboard() {
  const [tab, setTab] = useState("users");
  const [users, setUsers] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [packages, setPackages] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [destinationsLoaded, setDestinationsLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [actionError, setActionError] = useState("");

  // Package form state
  const [showPackageForm, setShowPackageForm] = useState(false);
  const [editingPackageId, setEditingPackageId] = useState(null);
  const [packageForm, setPackageForm] = useState(EMPTY_PACKAGE_FORM);
  const [packageFormError, setPackageFormError] = useState("");
  const [savingPackage, setSavingPackage] = useState(false);

  useEffect(() => {
    loadAll();
  }, []);

  async function loadAll() {
    setLoading(true);
    setLoadError("");
    const api = getApi();
    try {
      const [usersRes, reviewsRes, packagesRes] = await Promise.all([
        api.get("/users"),
        api.get("/reviews"),
        getPackagesApi().get("/"),
      ]);
      setUsers(usersRes.data);
      setReviews(reviewsRes.data);
      setPackages(packagesRes.data);
    } catch (err) {
      handleLoadError(err);
    } finally {
      setLoading(false);
    }

    // Destinations are for the package form's dropdown only — don't let a
    // failure here block the rest of the dashboard from loading.
    try {
      const destRes = await getDestinationsApi().get("/");
      setDestinations(destRes.data);
      setDestinationsLoaded(true);
    } catch (err) {
      console.warn("Could not load destinations for package form:", err);
      setDestinationsLoaded(false);
    }
  }

  function handleLoadError(err) {
    if (err.response?.status === 401) {
      setLoadError("You're not logged in (401). Please log in as an admin first.");
    } else if (err.response?.status === 403) {
      setLoadError("You're logged in, but not as an admin (403).");
    } else {
      setLoadError("Could not reach the backend. Make sure the server is running on port 5001.");
    }
  }

  async function handleDeleteUser(userId) {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    setActionError("");
    const prev = users;
    setUsers((curr) => curr.filter((u) => u._id !== userId));
    try {
      await getApi().delete(`/users/${userId}`);
    } catch (err) {
      setUsers(prev);
      setActionError("Could not delete user — check console for details.");
      console.error(err);
    }
  }

  async function handleApproveReview(reviewId) {
    setActionError("");
    try {
      await getApi().patch(`/reviews/${reviewId}/approve`);
      setReviews((curr) =>
        curr.map((r) => (r._id === reviewId ? { ...r, status: "approved" } : r))
      );
    } catch (err) {
      setActionError("Could not approve review — check console for details.");
      console.error(err);
    }
  }

  async function handleRejectReview(reviewId) {
    setActionError("");
    try {
      await getApi().patch(`/reviews/${reviewId}/reject`);
      setReviews((curr) =>
        curr.map((r) => (r._id === reviewId ? { ...r, status: "rejected" } : r))
      );
    } catch (err) {
      setActionError("Could not reject review — check console for details.");
      console.error(err);
    }
  }

  async function handleDeleteReview(reviewId) {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    setActionError("");
    const prev = reviews;
    setReviews((curr) => curr.filter((r) => r._id !== reviewId));
    try {
      await getApi().delete(`/reviews/${reviewId}`);
    } catch (err) {
      setReviews(prev);
      setActionError("Could not delete review — check console for details.");
      console.error(err);
    }
  }

  // ---------- Packages ----------

  function openAddPackageForm() {
    setEditingPackageId(null);
    setPackageForm(EMPTY_PACKAGE_FORM);
    setPackageFormError("");
    setShowPackageForm(true);
  }

  function openEditPackageForm(pkg) {
    setEditingPackageId(pkg._id);
    setPackageForm({
      name: pkg.name || "",
      destination: pkg.destination?._id || pkg.destination || "",
      duration: pkg.duration ?? "",
      price: pkg.price ?? "",
      itinerary: Array.isArray(pkg.itinerary) ? pkg.itinerary.join("\n") : (pkg.itinerary || ""),
      inclusions: Array.isArray(pkg.inclusions) ? pkg.inclusions.join(", ") : (pkg.inclusions || ""),
      exclusions: Array.isArray(pkg.exclusions) ? pkg.exclusions.join(", ") : (pkg.exclusions || ""),
      images: Array.isArray(pkg.images) ? pkg.images.join(", ") : (pkg.images || ""),
      travelStart: pkg.travelDates?.start ? pkg.travelDates.start.slice(0, 10) : "",
      travelEnd: pkg.travelDates?.end ? pkg.travelDates.end.slice(0, 10) : "",
    });
    setPackageFormError("");
    setShowPackageForm(true);
  }

  function closePackageForm() {
    setShowPackageForm(false);
    setEditingPackageId(null);
    setPackageForm(EMPTY_PACKAGE_FORM);
    setPackageFormError("");
  }

  function handlePackageFieldChange(field, value) {
    setPackageForm((curr) => ({ ...curr, [field]: value }));
  }

  function buildPackagePayload() {
    return {
      name: packageForm.name.trim(),
      destination: packageForm.destination,
      duration: packageForm.duration,
      price: Number(packageForm.price),
      itinerary: packageForm.itinerary
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      inclusions: packageForm.inclusions
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      exclusions: packageForm.exclusions
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      images: packageForm.images
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      travelDates: {
        start: packageForm.travelStart || undefined,
        end: packageForm.travelEnd || undefined,
      },
    };
  }

  async function handleSubmitPackage(e) {
    e.preventDefault();
    setPackageFormError("");

    if (!packageForm.name.trim() || !packageForm.destination) {
      setPackageFormError("Name and destination are required.");
      return;
    }

    setSavingPackage(true);
    const payload = buildPackagePayload();

    try {
      if (editingPackageId) {
        const res = await getPackagesApi().put(`/${editingPackageId}`, payload);
        setPackages((curr) =>
          curr.map((p) => (p._id === editingPackageId ? res.data.package : p))
        );
      } else {
        const res = await getPackagesApi().post("/", payload);
        setPackages((curr) => [res.data.package, ...curr]);
      }
      closePackageForm();
    } catch (err) {
      console.error(err);
      setPackageFormError(
        err.response?.data?.message || "Could not save package — check console for details."
      );
    } finally {
      setSavingPackage(false);
    }
  }

  async function handleDeletePackage(packageId) {
    if (!window.confirm("Are you sure you want to delete this package?")) return;
    setActionError("");
    const prev = packages;
    setPackages((curr) => curr.filter((p) => p._id !== packageId));
    try {
      await getPackagesApi().delete(`/${packageId}`);
    } catch (err) {
      setPackages(prev);
      setActionError("Could not delete package — check console for details.");
      console.error(err);
    }
  }

  if (loading) {
    return <div className="admin-dashboard">Loading admin dashboard...</div>;
  }

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>

      <div className="admin-tabs">
        <button
          className={tab === "users" ? "tab active" : "tab"}
          onClick={() => setTab("users")}
        >
          User Management
        </button>
        <button
          className={tab === "reviews" ? "tab active" : "tab"}
          onClick={() => setTab("reviews")}
        >
          Review Moderation
        </button>
        <button
          className={tab === "packages" ? "tab active" : "tab"}
          onClick={() => setTab("packages")}
        >
          Packages
        </button>
      </div>

      {loadError && <div className="action-error">{loadError}</div>}
      {actionError && <div className="action-error">{actionError}</div>}

      {tab === "users" && (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>
                  <button
                    className="action-btn delete"
                    onClick={() => handleDeleteUser(u._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {tab === "reviews" && (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Reviewer</th>
              <th>Package</th>
              <th>Review</th>
              <th>Rating</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((r) => (
              <tr key={r._id}>
                <td>{r.userId?.name || "Unknown"}</td>
                <td>{r.packageId?.name || "Unknown"}</td>
                <td>{r.reviewText}</td>
                <td>{r.rating} / 5</td>
                <td>
                  <span className={`status-pill ${r.status}`}>{r.status}</span>
                </td>
                <td className="actions-cell">
                  <button
                    className="action-btn approve"
                    disabled={r.status === "approved"}
                    onClick={() => handleApproveReview(r._id)}
                  >
                    Approve
                  </button>
                  <button
                    className="action-btn reject"
                    disabled={r.status === "rejected"}
                    onClick={() => handleRejectReview(r._id)}
                  >
                    Reject
                  </button>
                  <button
                    className="action-btn delete"
                    onClick={() => handleDeleteReview(r._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {tab === "packages" && (
        <div className="packages-tab">
          <button className="action-btn approve" onClick={openAddPackageForm}>
            + Add Package
          </button>

          {showPackageForm && (
            <form className="package-form" onSubmit={handleSubmitPackage}>
              <h3>{editingPackageId ? "Edit Package" : "New Package"}</h3>
              {packageFormError && <div className="action-error">{packageFormError}</div>}

              <label>
                Name
                <input
                  type="text"
                  value={packageForm.name}
                  onChange={(e) => handlePackageFieldChange("name", e.target.value)}
                  required
                />
              </label>

              <label>
                Destination
                {destinationsLoaded ? (
                  <select
                    value={packageForm.destination}
                    onChange={(e) => handlePackageFieldChange("destination", e.target.value)}
                    required
                  >
                    <option value="">Select a destination</option>
                    {destinations.map((d) => (
                      <option key={d._id} value={d._id}>
                        {d.name} {d.location ? `(${d.location})` : ""}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    placeholder="Destination ID (dropdown unavailable)"
                    value={packageForm.destination}
                    onChange={(e) => handlePackageFieldChange("destination", e.target.value)}
                    required
                  />
                )}
              </label>

              <label>
                Duration
                <input
                  type="text"
                  placeholder='e.g. "5 days / 4 nights"'
                  value={packageForm.duration}
                  onChange={(e) => handlePackageFieldChange("duration", e.target.value)}
                />
              </label>

              <label>
                Price
                <input
                  type="number"
                  min="0"
                  value={packageForm.price}
                  onChange={(e) => handlePackageFieldChange("price", e.target.value)}
                  required
                />
              </label>

              <label>
                Itinerary (one line per day)
                <textarea
                  rows={4}
                  value={packageForm.itinerary}
                  onChange={(e) => handlePackageFieldChange("itinerary", e.target.value)}
                />
              </label>

              <label>
                Inclusions (comma-separated)
                <input
                  type="text"
                  value={packageForm.inclusions}
                  onChange={(e) => handlePackageFieldChange("inclusions", e.target.value)}
                />
              </label>

              <label>
                Exclusions (comma-separated)
                <input
                  type="text"
                  value={packageForm.exclusions}
                  onChange={(e) => handlePackageFieldChange("exclusions", e.target.value)}
                />
              </label>

              <label>
                Image URLs (comma-separated)
                <input
                  type="text"
                  value={packageForm.images}
                  onChange={(e) => handlePackageFieldChange("images", e.target.value)}
                />
              </label>

              <div className="travel-dates-row">
                <label>
                  Travel start
                  <input
                    type="date"
                    value={packageForm.travelStart}
                    onChange={(e) => handlePackageFieldChange("travelStart", e.target.value)}
                  />
                </label>
                <label>
                  Travel end
                  <input
                    type="date"
                    value={packageForm.travelEnd}
                    onChange={(e) => handlePackageFieldChange("travelEnd", e.target.value)}
                  />
                </label>
              </div>

              <div className="form-actions">
                <button type="submit" className="action-btn approve" disabled={savingPackage}>
                  {savingPackage ? "Saving..." : editingPackageId ? "Save Changes" : "Create Package"}
                </button>
                <button type="button" className="action-btn reject" onClick={closePackageForm}>
                  Cancel
                </button>
              </div>
            </form>
          )}

          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Destination</th>
                <th>Duration</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {packages.map((p) => (
                <tr key={p._id}>
                  <td>{p.name}</td>
                  <td>{p.destination?.name || "Unknown"}</td>
                  <td>{p.duration}</td>
                  <td>{p.price}</td>
                  <td className="actions-cell">
                    <button className="action-btn" onClick={() => openEditPackageForm(p)}>
                      Edit
                    </button>
                    <button className="action-btn delete" onClick={() => handleDeletePackage(p._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;