import { useState } from "react";
import { registerUser } from "../services/authService";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await registerUser({
      name,
      email,
      password,
    });

    console.log(response.data);
    alert("Registration Successful");
  } catch (error) {
    console.error(error.response?.data);
    alert(error.response?.data?.message || "Registration Failed");
  }
};
}
export default Register;