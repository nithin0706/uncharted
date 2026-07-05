import TopAppBar from "./TopAppBar";
import BottomNav from "./BottomNav";

// Navbar is now a thin wrapper: TopAppBar handles desktop navigation,
// BottomNav handles mobile navigation. Kept as a single component so
// App.jsx doesn't need to change — it still just renders <Navbar />.
export default function Navbar() {
  return (
    <>
      <TopAppBar />
      <BottomNav />
    </>
  );
}
