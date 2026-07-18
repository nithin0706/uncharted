import { Link } from "react-router-dom";
import { User, Heart, Users } from "lucide-react";

export default function TopAppBar() {
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
        <Link
          to="/"
          className="text-[#E8C766] hover:text-white transition-colors"
        >
          Home
        </Link>

        <Link
          to="/destinations"
          className="text-[#E8C766]/80 hover:text-white transition-colors"
        >
          Destinations
        </Link>

        <Link
          to="/compare"
          className="text-[#E8C766]/80 hover:text-white transition-colors"
        >
          Compare
        </Link>

        <Link
          to="/guides"
          className="text-[#E8C766]/80 hover:text-white transition-colors inline-flex items-center gap-1"
        >
          <Users size={16} />
          Guides
        </Link>

        <Link
          to="/wishlist"
          className="text-[#E8C766]/80 hover:text-white transition-colors inline-flex items-center gap-1"
        >
          <Heart size={16} />
          Wishlist
        </Link>
      </nav>

      {/* Sign In / Register */}
      <div className="flex items-center gap-3">
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
      </div>
    </header>
  );
}