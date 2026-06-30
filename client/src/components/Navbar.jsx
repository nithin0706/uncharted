import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav>
      <Link to="/">Login</Link> |{" "}
      <Link to="/register">Register</Link> |{" "}
      <Link to="/profile">Profile</Link>
    </nav>
  );
}

export default Navbar;