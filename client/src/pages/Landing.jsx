import { useNavigate } from "react-router-dom";
import { MapPin, Star, ArrowRight } from "lucide-react";

const destinations = [
  { 
    name: "Banff, Canada", 
    img: "https://images.unsplash.com/photo-1558818061-547b1114aa6a?auto=format&fit=crop&w=800&q=80" 
  },
  { 
    name: "Santorini, Greece", 
    img: "https://images.unsplash.com/photo-1469796466635-455ede028aca?auto=format&fit=crop&w=800&q=80" 
  },
  { 
    name: "Kyoto, Japan", 
    img: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80" 
  },
];

const reviews = [
  { name: "Asha R.", text: "Best-organized trip I've ever taken. Every detail handled." },
  { name: "Marco T.", text: "The Banff route alone was worth booking. Stunning." },
];

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="bg-[#0B0B0F] text-[#F5F1E8] min-h-screen w-full overflow-x-hidden">

      {/* Hero Section - Unique Dramatic Mountain Landscape */}
      <section className="relative h-screen flex items-center justify-center pt-20">
        <img
          src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1920&q=80"
          alt="Dramatic mountain range landscape"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0F] via-black/40 to-black/25" />

        <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Explore the World's <span className="text-[#E8C766]">Wild Places</span>
          </h1>
          <p className="text-lg md:text-xl text-[#F5F1E8]/80 mb-10 max-w-xl mx-auto leading-relaxed">
            Curated trips to the planet's most breathtaking corners.
          </p>
          <button
            onClick={() => navigate("/destinations")}
            className="inline-flex items-center gap-2 bg-[#C9A227] text-[#0B0B0F] font-semibold px-7 py-3.5 rounded-lg hover:bg-[#E8C766] transition-all hover:shadow-lg"
          >
            Start Exploring <ArrowRight size={18} />
          </button>
        </div>
      </section>

      {/* Section: Destinations */}
      <section className="w-full py-24">
        <div className="max-w-7xl mx-auto px-8">
          <h2 className="text-3xl md:text-4xl font-semibold flex items-center gap-3 border-b border-white/5 pb-4">
            <MapPin className="text-[#C9A227]" size={28} /> Top Destinations
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
            {destinations.map((d) => (
              <div
                key={d.name}
                onClick={() => navigate("/destinations")}
                className="rounded-2xl overflow-hidden bg-[#16161C] shadow-lg border border-white/5 hover:border-[#C9A227]/20 transition-all duration-300 cursor-pointer"
              >
                <img 
                  src={d.img} 
                  alt={d.name} 
                  className="w-full h-72 object-cover" 
                />
                <div className="p-6">
                  <p className="font-semibold text-lg tracking-wide">{d.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section: Reviews */}
      <section className="w-full py-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-8">
          <h2 className="text-3xl md:text-4xl font-semibold flex items-center gap-3 pb-4">
            <Star className="text-[#C9A227]" size={28} /> What Travelers Say
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8 mt-10">
            {reviews.map((r) => (
              <div key={r.name} className="bg-[#16161C] rounded-2xl p-8 border border-white/5 shadow-lg">
                <p className="text-[#F5F1E8]/90 text-lg italic mb-5 leading-relaxed">"{r.text}"</p>
                <p className="text-sm text-[#9A958A] font-medium tracking-wider uppercase">— {r.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section: CTA */}
      <section className="py-24 border-t border-white/5">
        <div className="max-w-4xl mx-auto text-center px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Start Your Journey</h2>
          <p className="text-[#9A958A] text-lg max-w-md mx-auto">Pick a destination, we'll handle the rest.</p>
          <button
            onClick={() => navigate("/destinations")}
            className="mt-8 bg-[#C9A227] text-black px-8 py-4 rounded-xl font-semibold hover:bg-[#E8C766] transition-all transform hover:scale-[1.01] shadow-2xl"
          >
            Plan My Trip
          </button>
        </div>
      </section>

    </div>
  );
}
