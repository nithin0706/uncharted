import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import DestinationList from "./pages/DestinationList";
import DestinationDetail from "./pages/DestinationDetail";
import Navbar from "./components/Navbar";
import PackageComparison from "./pages/PackageComparison";
import TravelBuddy from "./pages/TravelBuddy";
import AdminDashboard from "./pages/AdminDashboard";
import Reviews from "./pages/Reviews";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/destinations" element={<DestinationList />} />
        <Route path="/destinations/:id" element={<DestinationDetail />} />
        <Route path="/compare" element={<PackageComparison />} />
        <Route path="/travel-buddy" element={<TravelBuddy />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/reviews/:packageId" element={<Reviews />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;