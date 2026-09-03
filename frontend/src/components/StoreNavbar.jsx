import { Leaf, UserRound, Search, Home, Store, Heart, ShoppingCart } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { openAuthModal, selectIsAuthenticated } from "../features/auth/authSlice";

const linkClass = ({ isActive }) =>
  isActive ? "text-green-700" : "hover:text-green-700 transition-colors";

const shrinkLinkClass = ({ isActive }) => `shrink-0 ${linkClass({ isActive })}`;

const StoreNavbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const [search, setSearch] = useState("");

  const handleSearch = () => {
    if (!search.trim()) return;

    navigate(
      `/Shop/ProductsListing?search=${encodeURIComponent(search)}`
    );
  };

  return (
    <nav className="absolute top-6 sm:top-10 left-0 w-full z-50 px-4 sm:px-6">
      <div className="relative flex items-center justify-center">

        {/* Navbar */}
        <div className="font-montenegrin flex w-full sm:w-fit items-center justify-between sm:justify-start gap-2 sm:gap-3 md:gap-6 lg:gap-8 rounded-full bg-white/50 backdrop-blur-md shadow-xl px-3 py-2 sm:px-6 sm:py-3">

          <Leaf className="w-6 h-6 text-black hover:text-green-700 cursor-pointer shrink-0" />

          {/* Mobile: icon-only nav */}
          <div className="flex md:hidden items-center gap-1.5 sm:gap-3 text-black min-w-0 flex-1 justify-center">
            <NavLink to="/" className={shrinkLinkClass} end title="Home" aria-label="Home">
              <Home size={19} />
            </NavLink>
            <NavLink to="/Shop" className={shrinkLinkClass} title="Shop" aria-label="Shop">
              <Store size={19} />
            </NavLink>

            <div className="relative min-w-[46px] max-w-[120px] flex-1">
              <Search size={13} className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch();
                  }
                }}
                aria-label="Search plants"
                className="w-full min-w-0 rounded-full border border-gray-300 bg-white py-1.5 pl-6 pr-2 text-xs placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-green-600"
              />
            </div>

            <NavLink to="/Shop/Wishlist" className={shrinkLinkClass} title="Wishlist" aria-label="Wishlist">
              <Heart size={19} />
            </NavLink>

            <NavLink to="/Shop/Cart" className={shrinkLinkClass} title="Cart" aria-label="Cart">
              <ShoppingCart size={19} />
            </NavLink>
          </div>

          {/* Tablet and up: full text nav */}
          <div className="hidden md:flex items-center gap-3 md:gap-4 lg:gap-8 text-black">

            <NavLink to="/" className={linkClass}>
              Home
            </NavLink>
            <NavLink to="/Shop" className={linkClass}>
              Shop
            </NavLink>

            {/* Search */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Search plants..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch();
                  }
                }}
                className="rounded-full border border-gray-300 bg-white px-4 py-2 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-green-600 w-32 md:w-36 lg:w-56"
              />

              <button
                onClick={handleSearch}
                className="cursor-pointer hover:text-green-700"
              >
                <Search />
              </button>
            </div>

            <NavLink to="/Shop/Wishlist" className={linkClass}>
              Wishlist
            </NavLink>

            <NavLink to="/Shop/Cart" className={linkClass}>
              Cart
            </NavLink>

          </div>

          {isAuthenticated ? (
            <NavLink
              to="/Account"
              className="rounded-full bg-black p-2 text-white transition-colors hover:text-green-500 shrink-0"
            >
              <UserRound />
            </NavLink>
          ) : (
            <button
              type="button"
              onClick={() => dispatch(openAuthModal("login"))}
              className="rounded-full bg-black px-2.5 py-1.5 text-[11px] sm:px-4 sm:py-2 sm:text-sm font-semibold text-white transition-colors hover:text-green-500 cursor-pointer whitespace-nowrap shrink-0"
            >
              Login / Sign Up
            </button>
          )}

        </div>
      </div>
    </nav>
  );
};

export default StoreNavbar;
