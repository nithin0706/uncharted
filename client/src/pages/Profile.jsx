import { useEffect, useState } from "react";
import { getProfile } from "../services/authService";
import { getBookingHistory } from "../services/bookingService";
import { getWishlist } from "../services/wishlistService";
import { useNavigate, Link } from "react-router-dom";
import { useCompare } from "../context/CompareContext";
import { Backpack, Heart, ArrowLeftRight, LogOut } from "lucide-react";

function Profile() {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [wishlistCount, setWishlistCount] = useState(0);
  const navigate = useNavigate();
  const { compareList } = useCompare();

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const profileRes = await getProfile(token);
        const userData = profileRes.data.user;
        setUser(userData);

        const userId = userData.id || userData._id;
        const bookingsRes = await getBookingHistory(userId, token);
        setBookings(bookingsRes.data);

        const wishlistRes = await getWishlist(token);
        setWishlistCount(wishlistRes.data.length);
      } catch (error) {
        console.error("Profile view loading error:", error);
        navigate("/login");
      }
    };
    fetchAll();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black px-4 pt-24 pb-16">
      <div className="w-full max-w-2xl mx-auto">
        {/* Avatar + name */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 rounded-full bg-[#C9A227] flex items-center justify-center text-3xl font-bold text-black mb-4">
            {user.name?.[0]?.toUpperCase()}
          </div>
          <h1 className="text-2xl font-serif font-bold text-[#E8C766]">
            {user.name}
          </h1>
          <span className="text-xs uppercase tracking-wide text-[#C9A227]/70 mt-1">
            {user.role}
          </span>
          <p className="text-sm text-[#9A958A] mt-2">{user.email}</p>
        </div>

        {/* Quick stats row */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          <a
            href="#bookings"
            className="bg-white/5 border border-white/10 rounded-xl p-4 text-center hover:border-[#C9A227] transition-colors"
          >
            <Backpack size={20} className="text-[#C9A227] mx-auto mb-1" />
            <p className="text-lg font-bold text-white">{bookings.length}</p>
            <p className="text-xs text-[#9A958A]">Bookings</p>
          </a>
          <Link
            to="/wishlist"
            className="bg-white/5 border border-white/10 rounded-xl p-4 text-center hover:border-[#C9A227] transition-colors"
          >
            <Heart size={20} className="text-[#C9A227] mx-auto mb-1" />
            <p className="text-lg font-bold text-white">{wishlistCount}</p>
            <p className="text-xs text-[#9A958A]">Wishlist</p>
          </Link>
          <Link
            to="/compare"
            className="bg-white/5 border border-white/10 rounded-xl p-4 text-center hover:border-[#C9A227] transition-colors"
          >
            <ArrowLeftRight size={20} className="text-[#C9A227] mx-auto mb-1" />
            <p className="text-lg font-bold text-white">{compareList.length}</p>
            <p className="text-xs text-[#9A958A]">Compare</p>
          </Link>
        </div>

        {/* My Bookings */}
        <section id="bookings" className="mb-8">
          <h2 className="text-xl font-semibold text-[#E8C766] mb-4">My Bookings</h2>
          {bookings.length === 0 ? (
            <p className="text-[#9A958A] text-sm">No bookings yet.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {bookings.map((b) => (
                <div
                  key={b._id}
                  className="bg-white/5 border border-white/10 rounded-xl p-4 flex justify-between items-center"
                >
                  <div>
                    <p className="text-white font-semibold">
                      {b.packageId?.name || "Package"}
                    </p>
                    <p className="text-sm text-[#9A958A]">
                      {new Date(b.travelDate).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}{" "}
                      · {b.numberOfPeople} {b.numberOfPeople === 1 ? "person" : "people"}
                    </p>
                  </div>
                  <span
                    className={`text-xs px-3 py-1 rounded-full ${
                      b.bookingStatus === "Cancelled"
                        ? "bg-red-500/20 text-red-400"
                        : "bg-[#C9A227]/20 text-[#C9A227]"
                    }`}
                  >
                    {b.bookingStatus}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-[#C9A227] text-black py-3 rounded-lg font-semibold hover:bg-[#E8C766] transition-all"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;