import { useEffect, useState } from "react";
import { getProfile } from "../services/authService";
import { useNavigate } from "react-router-dom";

function Profile() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/login");
          return;
        }

        const response = await getProfile(token);
        setUser(response.data.user);
      } catch (error) {
        console.error(error);
        navigate("/login");
      }
    };
    fetchProfile();
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
    <div className="min-h-screen flex items-center justify-center bg-black px-4 pt-24">
      <div className="w-full max-w-sm bg-white/5 border border-white/10 rounded-xl p-8">
        <div className="flex flex-col items-center mb-6">
          <div className="w-20 h-20 rounded-full bg-[#C9A227] flex items-center justify-center text-3xl font-bold text-black mb-4">
            {user.name?.[0]?.toUpperCase()}
          </div>
          <h1 className="text-2xl font-serif font-bold text-[#E8C766]">
            {user.name}
          </h1>
          <span className="text-xs uppercase tracking-wide text-[#C9A227]/70 mt-1">
            {user.role}
          </span>
        </div>

        <div className="flex flex-col gap-3 text-white mb-6">
          <div>
            <p className="text-sm text-[#E8C766]/70">Email</p>
            <p>{user.email}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full bg-[#C9A227] text-white py-2 rounded-lg font-semibold hover:bg-[#E8C766] transition-all"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Profile;