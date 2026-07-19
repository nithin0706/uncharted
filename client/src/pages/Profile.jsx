import { useEffect, useState } from "react";
import { getProfile } from "../services/authService";
import { getBookingHistory, cancelBooking, getBookingById } from "../services/bookingService";
import { getWishlist } from "../services/wishlistService";
import { useNavigate, Link } from "react-router-dom";
import { useCompare } from "../context/CompareContext";
import { Backpack, Heart, ArrowLeftRight, LogOut, XCircle, Calendar, Users, ShieldCheck, Clock } from "lucide-react";

function Profile() {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [cancellingId, setCancellingId] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
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

  const viewBookingDetails = async (bookingId) => {
    setLoadingDetails(true);
    const token = localStorage.getItem("token");
    try {
      const res = await getBookingById(bookingId, token);
      setSelectedBooking(res.data);
    } catch (error) {
      console.error("Error fetching single booking details:", error);
      alert("Could not load booking details.");
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleCancel = async (e, bookingId) => {
    e.stopPropagation(); // Stop from opening the modal details view
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;

    const token = localStorage.getItem("token");
    setCancellingId(bookingId);

    try {
      await cancelBooking(bookingId, token);
      setBookings((prev) =>
        prev.map((b) =>
          b._id === bookingId ? { ...b, bookingStatus: "Cancelled" } : b
        )
      );
      if (selectedBooking && selectedBooking._id === bookingId) {
        setSelectedBooking((prev) => ({ ...prev, bookingStatus: "Cancelled" }));
      }
      alert("Booking cancelled successfully.");
    } catch (error) {
      console.error("Cancellation error:", error);
      alert(error.response?.data?.message || "Failed to cancel booking.");
    } finally {
      setCancellingId(null);
    }
  };

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

  const activeBookingsCount = bookings.filter((b) => b.bookingStatus !== "Cancelled").length;

  return (
    <div className="min-h-screen bg-black px-4 pt-24 pb-16 relative">
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
            <p className="text-lg font-bold text-white">{activeBookingsCount}</p>
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
                  onClick={() => viewBookingDetails(b._id)}
                  className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:border-white/20 transition-all"
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
                  
                  <div className="flex items-center gap-3 self-end sm:self-center">
                    <span
                      className={`text-xs px-3 py-1 rounded-full ${
                        b.bookingStatus === "Cancelled"
                          ? "bg-red-500/20 text-red-400"
                          : "bg-[#C9A227]/20 text-[#C9A227]"
                      }`}
                    >
                      {b.bookingStatus}
                    </span>

                    {b.bookingStatus !== "Cancelled" && (
                      <button
                        onClick={(e) => handleCancel(e, b._id)}
                        disabled={cancellingId === b._id}
                        className="flex items-center gap-1 text-xs text-black font-semibold bg-[#C9A227] hover:bg-[#E8C766] px-3 py-1 rounded-lg transition-all disabled:opacity-50"
                      >
                        <XCircle size={14} />
                        {cancellingId === b._id ? "Cancelling..." : "Cancel"}
                      </button>
                    )}
                  </div>
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

      {/* Dynamic Detail Modal View */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#16161C] border border-white/10 rounded-2xl w-full max-w-md p-6 relative text-white">
            <h3 className="text-xl font-serif font-bold text-[#E8C766] mb-2">
              Booking Invoice Details
            </h3>
            <p className="text-xs text-[#9A958A] mb-4 break-all">
              Reference ID: {selectedBooking._id}
            </p>

            <div className="space-y-4 border-t border-b border-white/10 py-4 my-4">
              <div className="flex items-center gap-3">
                <ShieldCheck className="text-[#C9A227]" size={18} />
                <div>
                  <p className="text-xs text-[#9A958A]">Selected Destination</p>
                  <p className="text-sm font-semibold">{selectedBooking.packageId?.name || "Tour Package"}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="text-[#C9A227]" size={18} />
                <div>
                  <p className="text-xs text-[#9A958A]">Departure Date</p>
                  <p className="text-sm font-semibold">
                    {new Date(selectedBooking.travelDate).toLocaleDateString("en-IN", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      year: "numeric"
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Users className="text-[#C9A227]" size={18} />
                <div>
                  <p className="text-xs text-[#9A958A]">Total Registered Members</p>
                  <p className="text-sm font-semibold">{selectedBooking.numberOfPeople} Registered</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="text-[#C9A227]" size={18} />
                <div>
                  <p className="text-xs text-[#9A958A]">Processing Status</p>
                  <span className={`text-xs px-2.5 py-0.5 rounded-full inline-block mt-0.5 ${
                    selectedBooking.bookingStatus === "Cancelled"
                      ? "bg-red-500/20 text-red-400"
                      : "bg-[#C9A227]/20 text-[#C9A227]"
                  }`}>
                    {selectedBooking.bookingStatus}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              {selectedBooking.bookingStatus !== "Cancelled" && (
                <button
                  onClick={(e) => handleCancel(e, selectedBooking._id)}
                  disabled={cancellingId === selectedBooking._id}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-xl font-semibold text-sm transition-all disabled:opacity-50"
                >
                  Cancel Trip
                </button>
              )}
              <button
                onClick={() => setSelectedBooking(null)}
                className="flex-1 bg-white/10 hover:bg-white/20 text-white py-2.5 rounded-xl font-semibold text-sm transition-all"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading Indicator Modal */}
      {loadingDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="text-[#E8C766] font-semibold animate-pulse">Fetching Trip Details...</div>
        </div>
      )}
    </div>
  );
}

export default Profile;