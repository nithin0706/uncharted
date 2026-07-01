import { UserCircle, MapPin, Phone, Star } from "lucide-react";

function GuideCard({ guide }) {
  return (
    <div className="guide-card">

      <div className="guide-header">
        <UserCircle className="guide-avatar" size={70} />

        <div>
          <h2>{guide.name}</h2>

          <div className="experience">
            <Star size={16} fill="#C9A227" stroke="#C9A227" />
            <span>{guide.experience} Years Experience</span>
          </div>
        </div>
      </div>

      <div className="guide-details">

        <div className="detail">
          <span className="label">Specialization</span>
          <p>{guide.specialization}</p>
        </div>

        <div className="detail">
          <MapPin size={18} />
          <p>{guide.location}</p>
        </div>

        <div className="detail">
          <Phone size={18} />
          <p>{guide.contact}</p>
        </div>

      </div>

      <button className="guide-btn">
        Choose Guide
      </button>

    </div>
  );
}

export default GuideCard;