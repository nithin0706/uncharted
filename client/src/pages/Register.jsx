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

      console.log(response.data);
      alert("Registration Successful");
      navigate("/login");
    } catch (error) {
      console.error(error.response?.data);
      alert(error.response?.data?.message || "Registration Failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <div className="w-full max-w-sm bg-white/5 border border-white/10 rounded-xl p-8">
        <h1 className="text-2xl font-serif font-bold text-[#E8C766] mb-6 text-center">
          Register
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm text-[#E8C766]/80 mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white focus:outline-none focus:border-[#C9A227]"
            />
          </div>

          <div>
            <label className="block text-sm text-[#E8C766]/80 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white focus:outline-none focus:border-[#C9A227]"
            />
          </div>

          <div>
            <label className="block text-sm text-[#E8C766]/80 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white focus:outline-none focus:border-[#C9A227]"
            />
          </div>

          <button
            type="submit"
            className="mt-2 bg-[#C9A227] text-white py-2 rounded-lg font-semibold hover:bg-[#E8C766] transition-all"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;