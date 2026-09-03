import { Leaf, UserRound, Home, Store, ScanLine, Info, Phone } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { openAuthModal, selectIsAuthenticated } from "../features/auth/authSlice";

const linkClass = ({ isActive }) =>
  isActive ? "text-green-700" : "text-black hover:text-green-700";

const Navbar = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);

  return (
    <nav className="flex items-center justify-center pt-6 sm:pt-10 px-4 absolute top-0 w-full z-50">

      <div className="font-montenegrin rounded-full bg-white flex justify-between md:justify-around gap-2 sm:gap-3 md:gap-10 items-center p-2 sm:p-3 w-full sm:w-fit mx-auto bg-white/50 backdrop-blur-md shadow-2xl">
        <div className="w-6 h-6 text-black hover:text-green-700 shrink-0"><Leaf /></div>

        {/* Mobile: icon-only nav */}
        <div className="flex md:hidden text-black items-center justify-center gap-2 sm:gap-3">
          <NavLink to="/" className={linkClass} end title="Home" aria-label="Home">
            <Home size={20} />
          </NavLink>
          <NavLink to="/Shop" className={linkClass} title="Shop" aria-label="Shop">
            <Store size={20} />
          </NavLink>
          <NavLink to="/ScanPlant" className={linkClass} title="Scan Plant" aria-label="Scan Plant">
            <ScanLine size={20} />
          </NavLink>
          <NavLink to="/AboutUs" className={linkClass} title="About Us" aria-label="About Us">
            <Info size={20} />
          </NavLink>
          <NavLink to="/ContactUs" className={linkClass} title="Contact Us" aria-label="Contact Us">
            <Phone size={20} />
          </NavLink>
        </div>

        {/* Tablet and up: full text nav */}
        <div className="hidden md:flex text-black items-center justify-center gap-6 lg:gap-10">
          <NavLink to="/" className="hover:text-green-700" end>
            Home
          </NavLink>
          <NavLink to="/Shop" className={linkClass}>
            Shop
          </NavLink>
          <NavLink to="/ScanPlant" className={linkClass}>
            Scan Plant
          </NavLink>
          <NavLink to="/AboutUs" className={linkClass}>
            About Us
          </NavLink>
          <NavLink to="/ContactUs" className={linkClass}>
            Contact Us
          </NavLink>
        </div>

        {isAuthenticated ? (
          <NavLink
            to="/Account"
            className="flex flex-row bg-black text-white rounded-full p-2 hover:text-green-700 shrink-0"
          >
            <UserRound />
          </NavLink>
        ) : (
          <button
            type="button"
            onClick={() => dispatch(openAuthModal("login"))}
            className="flex flex-row bg-black text-white rounded-full px-2.5 py-1.5 text-[11px] sm:px-4 sm:py-2 sm:text-sm font-semibold hover:text-green-500 cursor-pointer whitespace-nowrap shrink-0"
          >
            Login / Sign Up
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
