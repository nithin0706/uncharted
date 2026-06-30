import { useState } from "react";

const StarRating = ({ rating, onRatingChange, readOnly = false }) => {
    const [hover, setHover] = useState(0);

    return (
        <div style={{ display: "flex", gap: "4px" }}>
            {[1, 2, 3, 4, 5].map((star) => (
                <span
                    key={star}
                    onClick={() => !readOnly && onRatingChange(star)}
                    onMouseEnter={() => !readOnly && setHover(star)}
                    onMouseLeave={() => !readOnly && setHover(0)}
                    style={{
                        fontSize: "24px",
                        cursor: readOnly ? "default" : "pointer",
                        color: star <= (hover || rating) ? "#f5a623" : "#ccc",
                    }}
                >
                    ★
                </span>
            ))}
        </div>
    );
};

export default StarRating;