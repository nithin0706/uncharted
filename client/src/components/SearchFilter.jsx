import { useState } from "react";

const SearchFilter = ({ onSearch }) => {
    const [query, setQuery] = useState("");

    const handleChange = (e) => {
        setQuery(e.target.value);
        onSearch(e.target.value);
    };

    return (
        <div style={{ marginBottom: "16px" }}>
            <input
                type="text"
                placeholder="Search by destination or location..."
                value={query}
                onChange={handleChange}
                style={{
                    padding: "10px",
                    width: "300px",
                    borderRadius: "6px",
                    border: "1px solid #ccc",
                    fontSize: "14px",
                }}
            />
        </div>
    );
};

export default SearchFilter;
