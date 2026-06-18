function Profile() {
  const user = {
    name: "Nandana",
    email: "nandana@gmail.com",
    role: "User",
  };
  const handleLogout = () => {
    localStorage.removeItem("token");
    alert("Logged out");
  };
  return (
    <div>
      <h1>Profile Page</h1>

      <p>Name: {user.name}</p>
      <p>Email: {user.email}</p>
      <p>Role: {user.role}</p>

      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Profile;