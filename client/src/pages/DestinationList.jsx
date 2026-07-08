import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchFilter from "../components/SearchFilter";
import axios from "axios";

const DestinationList = () => {
    const [destinations, setDestinations] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    
    // State to hold IDs of destinations selected for comparison
    const [selectedIds, setSelectedIds] = useState([]);
    
    const navigate = useNavigate();

    // Load initial packages and sync selected items from localStorage if any exist
    useEffect(() => {
        const savedCompare = JSON.parse(localStorage.getItem("compare_packages")) || [];
        setSelectedIds(savedCompare);

        // Pointing to your core backend app port (5001)
axios.get(`${import.meta.env.VITE_API_URL}/api/destinations`)
            .then((res) => {
                setDestinations(res.data);
                setFiltered(res.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setError("Could not load destinations.");
                setLoading(false);
            });
    }, []);

    const handleSearch = (query) => {
        const result = destinations.filter((d) =>
            d.name?.toLowerCase().includes(query.toLowerCase()) ||
            d.location?.toLowerCase().includes(query.toLowerCase())
        );
        setFiltered(result);
    };

    // Toggle logic for selection matrix
    const toggleCompare = (e, id) => {
        e.stopPropagation(); // Prevents clicking the checkbox/button from firing the card's navigate event
        
        let updatedIds;
        if (selectedIds.includes(id)) {
            updatedIds = selectedIds.filter((itemIds) => itemIds !== id);
        } else {
            if (selectedIds.length >= 4) {
                alert("You can compare up to 4 destinations at a time.");
                return;
            }
            updatedIds = [...selectedIds, id];
        }
        
        setSelectedIds(updatedIds);
        localStorage.setItem("compare_packages", JSON.stringify(updatedIds));
    };

    if (loading) return <p className="pc-loading">Loading destinations...</p>;
    if (error) return <p className="pc-error">{error}</p>;

    return (
        <div className="pc-page">
            <header className="pc-header">
                <h1>Explore Destinations</h1>
                <p className="pc-subtitle">Discover and compare your next unmatched adventure</p>
            </header>

            <SearchFilter onSearch={handleSearch} />
            
            <div className="pc-selector" style={{ marginTop: "30px" }}>
                <h2 className="pc-section-title">Available Packages</h2>
                <div className="pc-cards-grid">
                    {filtered.length === 0 ? (
                        <p>No destinations found.</p>
                    ) : (
                        filtered.map((dest) => {
                            const isSelected = selectedIds.includes(dest._id);
                            return (
                                <div
                                    key={dest._id}
                                    onClick={() => navigate(`/destinations/${dest._id}`)}
                                    className={`pc-card ${isSelected ? "selected" : ""}`}
                                >
                                    {dest.images?.[0] && (
                                        <img
                                            src={dest.images[0]}
                                            alt={dest.name}
                                            className="pc-card-img"
                                        />
                                    )}
                                    
                                    {/* Small check indicator badge */}
                                    <div 
                                        className="pc-card-badge" 
                                        onClick={(e) => toggleCompare(e, dest._id)}
                                        style={{ cursor: "pointer" }}
                                    >
                                        {isSelected ? "✓ Added" : "+ Compare"}
                                    </div>

                                    <div className="pc-card-body">
                                        <h3 className="pc-card-name">{dest.name}</h3>
                                        <p className="pc-card-dest">{dest.location}</p>
                                        <p style={{ fontSize: "13px", color: "#9ca3af", marginBottom: "12px" }}>
                                            {dest.description ? `${dest.description.slice(0, 75)}...` : "No description available."}
                                        </p>
                                        
                                        <div className="pc-card-footer">
                                            <span className="pc-card-price">${dest.price || "N/A"}</span>
                                            <span className="pc-card-days">{dest.duration || "N/A"} Days</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {/* Floating Action Bar that appears when selections are active */}
            {selectedIds.length > 0 && (
                <div style={{
                    position: "fixed",
                    bottom: "20px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: "#1a1f2e",
                    border: "2px solid #3b82f6",
                    padding: "12px 24px",
                    borderRadius: "30px",
                    display: "flex",
                    alignItems: "center",
                    gap: "20px",
                    zIndex: 1000,
                    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.5)"
                }}>
                    <span style={{ fontSize: "0.9rem", color: "#e5e7eb" }}>
                        Selected: <strong>{selectedIds.length}</strong> / 4 destinations
                    </span>
                    <button 
                        onClick={() => navigate("/compare")}
                        style={{
                            background: "#3b82f6",
                            color: "#fff",
                            border: "none",
                            padding: "8px 16px",
                            borderRadius: "20px",
                            fontWeight: "600",
                            cursor: "pointer",
                            fontSize: "0.85rem"
                        }}
                    >
                        Compare Now →
                    </button>
                </div>
            )}
        </div>
    );
};

export default DestinationList;