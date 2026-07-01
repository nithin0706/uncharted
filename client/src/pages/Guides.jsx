import { useState, useEffect } from "react";
import {
  Search,
  MapPin,
  Sparkles,
  ShieldCheck,
  MessageCircle,
  Headphones,
} from "lucide-react";
import GuideCard from "../components/GuideCard";
import { getGuides } from "../services/guideService";
import "./Guides.css";

function Guides() {
  const [guides, setGuides] = useState([]);
  const [filteredGuides, setFilteredGuides] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchGuides();
  }, []);

  useEffect(() => {
    const filtered = guides.filter((guide) =>
      guide.name.toLowerCase().includes(search.toLowerCase()) ||
      guide.specialization.toLowerCase().includes(search.toLowerCase()) ||
      guide.location.toLowerCase().includes(search.toLowerCase())
    );

    setFilteredGuides(filtered);
  }, [search, guides]);

  const fetchGuides = async () => {
    try {
      const response = await getGuides();
      setGuides(response.data);
      setFilteredGuides(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="guides-page">

      {/* Hero Section */}
      <section className="guides-hero">

        <p className="hero-tag">
          MEET OUR EXPERTS
        </p>

        <h1>
          Travel <span>Guides</span>
        </h1>

        <p className="hero-subtitle">
          Choose experienced local guides to make every journey memorable.
        </p>

        <div className="search-box">

          <Search size={20} />

          <input
            type="text"
            placeholder="Search guides by name, location or specialization..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

        </div>

      </section>

      {/* Cards */}

      {filteredGuides.length === 0 ? (
        <div className="empty-state">

          <h2>No Guides Found</h2>

          <p>
            Try changing your search keyword.
          </p>

        </div>
      ) : (

        <div className="guide-grid">

          {filteredGuides.map((guide) => (

            <GuideCard
              key={guide._id}
              guide={guide}
            />

          ))}

        </div>

      )}

      {/* Bottom Features */}

      <section className="guide-features">

        <div className="feature-box">

          <ShieldCheck />

          <h3>Verified Guides</h3>

          <p>
            Experienced professionals you can trust.
          </p>

        </div>

        <div className="feature-box">

          <MessageCircle />

          <h3>Local Expertise</h3>

          <p>
            Explore destinations with knowledgeable locals.
          </p>

        </div>

        <div className="feature-box">

          <Headphones />

          <h3>24/7 Support</h3>

          <p>
            Assistance whenever you need it.
          </p>

        </div>

      </section>

    </div>
  );
}

export default Guides;