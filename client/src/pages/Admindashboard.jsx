import { useEffect, useState } from "react";
import axios from "axios";
import "./Admindashboard.css";

const API_BASE = `${import.meta.env.VITE_API_URL}/api/admin`;

function getApi() {
  const token = localStorage.getItem("token");
  return axios.create({
    baseURL: API_BASE,
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  });
}

function AdminDashboard() {
  const [tab, setTab] = useState("users");
  const [users, setUsers] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [actionError, setActionError] = useState("");

  useEffect(() => {
    loadAll();
  }, []);

  async function loadAll() {
    setLoading(true);
    setLoadError("");
    const api = getApi();
    try {
      const [usersRes, reviewsRes] = await Promise.all([
        api.get("/users"),
        api.get("/reviews"),
      ]);
      setUsers(usersRes.data);
      setReviews(reviewsRes.data);
    } catch (err) {
      handleLoadError(err);
    } finally {
      setLoading(false);
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
      // Update only status to preserve populated user and package details
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
      // Update only status to preserve populated user and package details
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
    </div>
  );
}

export default AdminDashboard;