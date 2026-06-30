import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav>
      <Link to="/">Login</Link> |{" "}
      <Link to="/register">Register</Link> |{" "}
      <Link to="/profile">Profile</Link> |{" "}
      <Link to="/compare">Compare Packages</Link> |{" "}
      {" | "}
      <Link to="/travel-buddy">Travel Buddy</Link>
      {" | "}
      <Link to="/admin">Admin Dashboard</Link>
    </nav>
  );
}

export default Navbar;