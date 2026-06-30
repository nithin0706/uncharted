import { loginUser } from "../services/authService";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./../styles/Login.css";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!email || !password) {
    alert("Please fill all fields");
    return;
  }

  try {
    const response = await loginUser({
      email,
      password,
    });

    localStorage.setItem("token", response.data.token);
    console.log(response.data);
    alert("Login successful");
    navigate("/packages");
  } catch (error) {
    console.error(error.response?.data);
    alert("Login failed");
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

        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;