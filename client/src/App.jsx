import { BrowserRouter, Routes, Route } from "react-router-dom";
import Reviews from "./pages/Reviews";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/reviews/:packageId" element={<Reviews />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;