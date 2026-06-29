import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import DestinationList from "./pages/DestinationList";
import DestinationDetail from "./pages/DestinationDetail";
import Navbar from "./components/Navbar";
import PackageComparison from "./pages/PackageComparison";


function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/destinations" element={<DestinationList/>} />
        <Route path="/destinations/:id" element={<DestinationDetail/>} />
        <Route path="/compare" element={<PackageComparison />} />
      </Routes>
     
    </BrowserRouter>
  );
}

export default App;