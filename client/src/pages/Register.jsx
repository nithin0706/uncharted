import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/authService";

function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      alert("Please fill all fields");
      return;
    }

    try {
      const response = await registerUser({
        name,
        email,
        password,
      });

      console.log("Backend response:", response.data);

      const token = response.data?.token;

      if (token) {
        localStorage.setItem("token", token);
        alert("Registration Successful");
        navigate("/profile");
      } else {
        console.error("No token in response:", response.data);
        alert("Registered but login failed — try signing in manually");
        navigate("/login");
      }
    } catch (error) {
      console.error(error.response?.data);
      alert(error.response?.data?.message || "Registration Failed");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center", 
        minHeight: "100vh", 
        fontFamily: "sans-serif",
        color: "#fff",
        padding: "100px 20px 40px", 
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          backgroundColor: "#111111",
          border: "1px solid #222",
          borderRadius: "12px",
          padding: "40px",
          width: "100%",
          maxWidth: "400px",
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.5)",
          textAlign: "center",
        }}
      >
        <h1 style={{ margin: "0 0 5px 0", fontSize: "28px", color: "#fff" }}>
          Create Account
        </h1>
        <p
          style={{
            margin: "0 0 25px 0",
            color: "#dfb134",
            fontSize: "14px",
            textTransform: "uppercase",
            letterSpacing: "1px",
            fontWeight: "bold",
          }}
        >
          Join Your Journey
        </p>

        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            width: "100%",
          }}
        >
          <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
            {/* Updated heading color to yellow */}
            <label style={{ fontSize: "14px", color: "#dfb134", marginBottom: "6px", fontWeight: "600" }}>Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your Name"
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "6px",
                border: "1px solid #2a2a2a",
                backgroundColor: "#1a1a1a",
                color: "#fff",
                boxSizing: "border-box",
                fontSize: "15px",
              }}
            />
          </div>

          <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
            {/* Updated heading color to yellow */}
            <label style={{ fontSize: "14px", color: "#dfb134", marginBottom: "6px", fontWeight: "600" }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "6px",
                border: "1px solid #2a2a2a",
                backgroundColor: "#1a1a1a",
                color: "#fff",
                boxSizing: "border-box",
                fontSize: "15px",
              }}
            />
          </div>

          <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
            {/* Updated heading color to yellow */}
            <label style={{ fontSize: "14px", color: "#dfb134", marginBottom: "6px", fontWeight: "600" }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "6px",
                border: "1px solid #2a2a2a",
                backgroundColor: "#1a1a1a",
                color: "#fff",
                boxSizing: "border-box",
                fontSize: "15px",
              }}
            />
          </div>

          <button
            type="submit"
            style={{
              backgroundColor: "#dfb134",
              color: "#000",
              border: "none",
              padding: "12px 24px",
              fontSize: "16px",
              fontWeight: "bold",
              borderRadius: "6px",
              cursor: "pointer",
              marginTop: "10px",
              width: "100%",
              transition: "opacity 0.2s ease",
            }}
            onMouseEnter={(e) => (e.target.style.opacity = "0.9")}
            onMouseLeave={(e) => (e.target.style.opacity = "1")}
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;