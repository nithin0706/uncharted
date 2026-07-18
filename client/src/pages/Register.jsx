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
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "80vh",
        color: "#fff",
        fontFamily: "sans-serif",
      }}
    >
      <h1>Register Page</h1>

      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "15px",
          width: "100%",
          maxWidth: "300px",
        }}
      >
        <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <label>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #444", backgroundColor: "#111", color: "#fff" }}
          />
        </div>

        <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #444", backgroundColor: "#111", color: "#fff" }}
          />
        </div>

        <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #444", backgroundColor: "#111", color: "#fff" }}
          />
        </div>

        <button
          type="submit"
          style={{
            backgroundColor: "#dfb134",
            color: "#000",
            border: "none",
            padding: "10px 20px",
            fontSize: "16px",
            fontWeight: "bold",
            borderRadius: "5px",
            cursor: "pointer",
            marginTop: "10px",
            width: "100%"
          }}
        >
          Register
        </button>
      </form>
    </div>
  );
}

export default Register;