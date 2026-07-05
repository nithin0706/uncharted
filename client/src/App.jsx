import Guides from "./pages/Guides";
import Wishlist from "./pages/Wishlist";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import DestinationsPage from "./pages/DestinationsPage";
import DestinationDetail from "./pages/DestinationDetail";
import Navbar from "./components/Navbar";
import ComparePage from "./pages/ComparePage";
import AdminDashboard from "./pages/AdminDashboard";
import Reviews from "./pages/Reviews";
import { CompareProvider } from "./context/CompareContext";

function App() {
  return (
    <BrowserRouter>
      <CompareProvider>
        <Navbar />
        <div className="pb-20 md:pb-0">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/destinations" element={<DestinationsPage />} />
            <Route path="/destinations/:id" element={<DestinationDetail />} />
            <Route path="/compare" element={<ComparePage />} />
            <Route path="/guides" element={<Guides />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/reviews/:packageId" element={<Reviews />} />
          </Routes>
        </div>
      </CompareProvider>
    </BrowserRouter>
  );
}

export default App;
