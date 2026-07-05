import { Link, useLocation } from "react-router-dom";
import { Home, Compass, ArrowLeftRight, Users, Heart } from "lucide-react";
import { useCompare } from "../context/CompareContext";

const NAV_ITEMS = [
  { to: "/", label: "Home", icon: Home },
  { to: "/destinations", label: "Explore", icon: Compass },
  { to: "/compare", label: "Compare", icon: ArrowLeftRight },
  { to: "/guides", label: "Guides", icon: Users },
  { to: "/wishlist", label: "Wishlist", icon: Heart },
];

export default function BottomNav() {
  const { pathname } = useLocation();
  const { compareList } = useCompare();

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 w-full z-50 bg-[#0B0B0F]/95 backdrop-blur-md border-t border-white/10 flex items-center justify-around py-2"
      aria-label="Primary mobile navigation"
    >
      {NAV_ITEMS.map(({ to, label, icon: Icon }) => {
        const isActive = pathname === to;
        const showBadge = to === "/compare" && compareList.length > 0;

        return (
          <Link
            key={to}
            to={to}
            className={`relative flex flex-col items-center gap-1 px-3 py-1.5 text-xs font-medium transition-colors ${
              isActive ? "text-[#C9A227]" : "text-[#9A958A] hover:text-[#E8C766]"
            }`}
          >
            <span className="relative">
              <Icon size={20} className={isActive ? "stroke-[2.5]" : ""} />
              {showBadge && (
                <span className="absolute -top-1.5 -right-2 bg-[#C9A227] text-[#0B0B0F] text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {compareList.length}
                </span>
              )}
            </span>
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
