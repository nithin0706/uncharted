import { Link, useNavigate } from "react-router-dom";
import { User, Heart, Users, LogOut } from "lucide-react";

export default function TopAppBar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-8 md:px-16 py-6 bg-black/10 backdrop-blur-md border-b border-white/5">
      {/* Brand */}
      <Link
        to="/"
        className="text-2xl md:text-3xl font-serif font-extrabold tracking-wide text-[#C9A227] hover:text-[#E8C766] transition-colors"
      >
        Uncharted
      </Link>

      {/* Navigation */}
      <nav className="hidden md:flex items-center gap-8 text-lg font-medium">
        <Link to="/" className="text-[#E8C766] hover:text-white transition-colors">
          Home
        </Link>
        <Link to="/destinations" className="text-[#E8C766]/80 hover:text-white transition-colors">
          Destinations
        </Link>
        <Link to="/compare" className="text-[#E8C766]/80 hover:text-white transition-colors">
          Compare
        </Link>
        <Link to="/guides" className="text-[#E8C766]/80 hover:text-white transition-colors inline-flex items-center gap-1">
          <Users size={16} />
          Guides
        </Link>
        <Link to="/wishlist" className="text-[#E8C766]/80 hover:text-white transition-colors inline-flex items-center gap-1">
          <Heart size={16} />
          Wishlist
        </Link>
      </nav>

      {/* Auth area */}
      <div className="flex items-center gap-3">
        {token ? (
          <>
            <Link
              to="/profile"
              className="text-[#E8C766]/80 hover:text-white transition-colors font-semibold"
            >
              Profile
            </Link>
            <button
              onClick={handleLogout}
              className="bg-[#C9A227] text-white px-5 py-2 rounded-lg font-semibold hover:bg-[#E8C766] transition-all inline-flex items-center gap-2 shadow-md"
            >
              <LogOut size={16} className="stroke-[2.5]" />
              <span>Logout</span>
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="text-[#E8C766]/80 hover:text-white transition-colors font-semibold"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="bg-[#C9A227] text-white px-5 py-2 rounded-lg font-semibold hover:bg-[#E8C766] transition-all inline-flex items-center gap-2 shadow-md"
            >
              <User size={16} className="stroke-[2.5]" />
              <span>Register</span>
            </Link>
          </>
        )}
      </div>
    </header>
  );
}