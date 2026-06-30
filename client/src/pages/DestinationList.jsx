import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchFilter from "../components/SearchFilter";
import axios from "axios";

const DestinationList = () => {
    const [destinations, setDestinations] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get("http://localhost:5000/api/destinations")
            .then((res) => {
                setDestinations(res.data);
                setFiltered(res.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    const handleSearch = (query) => {
        const result = destinations.filter((d) =>
            d.name.toLowerCase().includes(query.toLowerCase()) ||
            d.location.toLowerCase().includes(query.toLowerCase())
        );
        setFiltered(result);
    };

    if (loading) return <p>Loading destinations...</p>;

    return (
        <div style={{ padding: "20px" }}>
            <h1>Destinations</h1>
            <SearchFilter onSearch={handleSearch} />
            <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", marginTop: "20px" }}>
                {filtered.length === 0 ? (
                    <p>No destinations found.</p>
                ) : (
                    filtered.map((dest) => (
                        <div
                            key={dest._id}
                            onClick={() => navigate(`/destinations/${dest._id}`)}
                            style={{
                                border: "1px solid #ccc",
                                borderRadius: "8px",
                                padding: "16px",
                                width: "250px",
                                cursor: "pointer",
                            }}
                        >
                            {dest.images?.[0] && (
                                <img
                                    src={dest.images[0]}
                                    alt={dest.name}
                                    style={{ width: "100%", height: "150px", objectFit: "cover", borderRadius: "6px" }}
                                />
                            )}
                            <h3>{dest.name}</h3>
                            <p>{dest.location}</p>
                            <p style={{ fontSize: "13px", color: "#555" }}>{dest.description?.slice(0, 80)}...</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default DestinationList;
