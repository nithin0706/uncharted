import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const DestinationDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [destination, setDestination] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`http://localhost:5000/api/destinations/${id}`)
            .then((res) => {
                setDestination(res.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    }, [id]);

    if (loading) return <p>Loading...</p>;
    if (!destination) return <p>Destination not found.</p>;

    return (
        <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
            <button onClick={() => navigate(-1)} style={{ marginBottom: "16px" }}>← Back</button>
            <h1>{destination.name}</h1>
            <p><strong>Location:</strong> {destination.location}</p>
            <p>{destination.description}</p>
            {destination.images?.length > 0 && (
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "16px" }}>
                    {destination.images.map((img, i) => (
                        <img
                            key={i}
                            src={img}
                            alt={`img-${i}`}
                            style={{ width: "200px", height: "150px", objectFit: "cover", borderRadius: "6px" }}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default DestinationDetail;