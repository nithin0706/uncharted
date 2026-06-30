import { useState, useEffect } from "react";
import "./TravelBuddy.css";

const INTEREST_OPTIONS = [
  "Trekking", "Beaches", "Food", "Photography",
  "Nightlife", "History & Culture", "Adventure Sports", "Nature",
];

const TravelBuddy = () => {
  // ── Form state ──
  const [form, setForm] = useState({
    destination: "",
    startDate: "",
    endDate: "",
    budget: "",
    interests: [],
  });

  // ── Matches state ──
  const [matches, setMatches] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [requestedIds, setRequestedIds] = useState([]); // buddies already requested

  // Load existing matches on page load (optional convenience)
  useEffect(() => {
    fetchInitialMatches();
  }, []);

  const fetchInitialMatches = async () => {
    try {
      const res = await fetch("/api/buddies/matches");
      if (!res.ok) return; // silently skip if not ready yet
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        setMatches(data);
        setHasSearched(true);
      }
    } catch {
      // no-op: backend may not be reachable yet, form still works
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const toggleInterest = (interest) => {
    setForm((prev) => {
      const has = prev.interests.includes(interest);
      return {
        ...prev,
        interests: has
          ? prev.interests.filter((i) => i !== interest)
          : [...prev.interests, interest],
      };
    });
  };

  const validate = () => {
    if (!form.destination.trim()) return "Please enter a destination.";
    if (!form.startDate || !form.endDate) return "Please select your travel dates.";
    if (new Date(form.endDate) < new Date(form.startDate))
      return "End date cannot be before start date.";
    if (!form.budget || Number(form.budget) <= 0) return "Please enter a valid budget.";
    if (form.interests.length === 0) return "Select at least one interest.";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError("");
    setLoading(true);
    setHasSearched(true);

    try {
      const res = await fetch("/api/buddies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          destination: form.destination,
          startDate: form.startDate,
          endDate: form.endDate,
          budget: Number(form.budget),
          interests: form.interests,
        }),
      });

      if (!res.ok) throw new Error("Failed to save preferences");

      // After saving preferences, fetch matched buddies
      const matchRes = await fetch("/api/buddies/matches");
      if (!matchRes.ok) throw new Error("Failed to load matches");
      const matchData = await matchRes.json();
      setMatches(matchData);
    } catch (err) {
      setError("Something went wrong. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRequestBuddy = async (buddyId) => {
    try {
      const res = await fetch("/api/buddies/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ buddyId }),
      });
      if (!res.ok) throw new Error();
      setRequestedIds((prev) => [...prev, buddyId]);
    } catch {
      setError("Could not send request. Please try again.");
    }
  };

  return (
    <div className="tb-page">
      {/* ── Header ── */}
      <div className="tb-header">
        <h1>Find a Travel Buddy</h1>
        <p className="tb-subtitle">
          Tell us your trip plans and we'll match you with like-minded travelers.
        </p>
      </div>

      {error && <div className="tb-error">{error}</div>}

      {/* ── Preferences Form ── */}
      <form className="tb-form" onSubmit={handleSubmit}>
        <div className="tb-form-grid">
          <div className="tb-field">
            <label htmlFor="destination">Destination</label>
            <input
              id="destination"
              name="destination"
              type="text"
              placeholder="e.g. Goa, India"
              value={form.destination}
              onChange={handleChange}
            />
          </div>

          <div className="tb-field">
            <label htmlFor="budget">Budget (₹)</label>
            <input
              id="budget"
              name="budget"
              type="number"
              min="0"
              placeholder="e.g. 15000"
              value={form.budget}
              onChange={handleChange}
            />
          </div>

          <div className="tb-field">
            <label htmlFor="startDate">Start Date</label>
            <input
              id="startDate"
              name="startDate"
              type="date"
              value={form.startDate}
              onChange={handleChange}
            />
          </div>

          <div className="tb-field">
            <label htmlFor="endDate">End Date</label>
            <input
              id="endDate"
              name="endDate"
              type="date"
              value={form.endDate}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="tb-field tb-interests-field">
          <label>Interests</label>
          <div className="tb-interests-grid">
            {INTEREST_OPTIONS.map((interest) => (
              <button
                type="button"
                key={interest}
                className={`tb-interest-chip ${
                  form.interests.includes(interest) ? "active" : ""
                }`}
                onClick={() => toggleInterest(interest)}
              >
                {interest}
              </button>
            ))}
          </div>
        </div>

        <button type="submit" className="tb-submit-btn" disabled={loading}>
          {loading ? "Finding buddies…" : "Find My Travel Buddy"}
        </button>
      </form>

      {/* ── Matched Buddies ── */}
      {hasSearched && (
        <section className="tb-matches-section">
          <h2 className="tb-section-title">
            {loading
              ? "Searching…"
              : matches.length > 0
              ? `${matches.length} Matching Travelers`
              : "No Matches Yet"}
          </h2>

          {!loading && matches.length === 0 && (
            <p className="tb-empty">
              No travel buddies match your preferences right now. Try adjusting your
              dates, budget, or interests — or check back later as more travelers join.
            </p>
          )}

          <div className="tb-matches-grid">
            {matches.map((buddy) => (
              <div className="tb-buddy-card" key={buddy._id || buddy.id}>
                <div className="tb-buddy-avatar">
                  {(buddy.name || "?").charAt(0).toUpperCase()}
                </div>
                <div className="tb-buddy-info">
                  <h3>{buddy.name}</h3>
                  <p className="tb-buddy-dest">📍 {buddy.destination}</p>
                  <p className="tb-buddy-dates">
                    📅 {buddy.startDate} → {buddy.endDate}
                  </p>
                  <p className="tb-buddy-budget">💰 ₹{buddy.budget?.toLocaleString("en-IN")}</p>
                  <div className="tb-buddy-tags">
                    {(buddy.interests || []).map((tag) => (
                      <span key={tag} className="tb-tag">{tag}</span>
                    ))}
                  </div>
                  {buddy.matchScore !== undefined && (
                    <div className="tb-match-score">
                      {Math.round(buddy.matchScore)}% match
                    </div>
                  )}
                </div>
                <button
                  className="tb-request-btn"
                  onClick={() => handleRequestBuddy(buddy._id || buddy.id)}
                  disabled={requestedIds.includes(buddy._id || buddy.id)}
                >
                  {requestedIds.includes(buddy._id || buddy.id)
                    ? "Requested ✓"
                    : "Send Request"}
                </button>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default TravelBuddy;
