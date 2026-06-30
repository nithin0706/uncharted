import { loginUser } from "../services/authService";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import "./../styles/Login.css";

// Same backend base URL used by AdminDashboard.jsx
const API_BASE = "http://localhost:5000/api";

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

      // Save the token so AdminDashboard.jsx (and other protected pages) can use it
      localStorage.setItem("token", res.data.token);

      // Optional: save basic user info too, useful for showing "Hi, name" etc.
      if (res.data.user) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
      }

      console.log("Login successful:", res.data);
      // TODO: once you have routing set up for this, redirect the user here,
      // e.g. navigate("/") or navigate("/admin") depending on their role.
      alert("Login successful!");
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
      <h1>Login Page</h1>

      <form className="login-form" onSubmit={handleSubmit}>
        <div>
          <label>Email</label>
          <br />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <br />

        <div>
          <label>Password</label>
          <br />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <br />

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}

export default Login;
