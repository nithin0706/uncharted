import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import "./../styles/Login.css";

const API_BASE = `${import.meta.env.VITE_API_URL}/api`;

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/auth/login`, {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);

      if (res.data.user) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
      }

      console.log("Login successful:", res.data);

      const role = res.data.user?.role;
      if (role === "admin") {
        navigate("/admin");
      } else {
        // FIX: Redirect straight to the profile page instead of the landing page
        navigate("/profile");
      }
    } catch (err) {
      if (err.response?.status === 400 || err.response?.status === 401) {
        setError("Invalid email or password.");
      } else {
        setError("Could not reach the backend. Make sure it's running on port 5000.");
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">Welcome Back</h1>
        <p className="login-subtitle">Sign in to continue your journey</p>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-field">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>

          <div className="login-field">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          {error && <p className="login-error">{error}</p>}

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;