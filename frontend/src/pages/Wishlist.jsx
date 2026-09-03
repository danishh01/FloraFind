import { useDispatch, useSelector } from "react-redux";
import { Heart, LogIn } from "lucide-react";
import { Link } from "react-router-dom";

import StoreBackground from "../components/StoreBackground";
import StoreNavbar from "../components/StoreNavbar";
import ProductCard from "../components/ProductCard";
import SectionLoader from "../components/SectionLoader";
import { openAuthModal, selectIsAuthenticated } from "../features/auth/authSlice";

const Wishlist = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const wishlistItems = useSelector(
    (state) => state.wishlist.wishlistItems
  );
  const wishlistStatus = useSelector((state) => state.wishlist.status);

  if (!isAuthenticated) {
    return (
      <StoreBackground className="min-h-screen">
        <StoreNavbar />
        <div className="min-h-screen flex justify-center items-center px-6">
          <div className="bg-white border-3 border-black rounded-3xl p-14 text-center flex flex-col items-center gap-4 hero-heading">
            <Heart size={70} className="text-red-500 fill-red-500" />
            <h2 className="text-3xl font-bold text-black">Login to view your wishlist</h2>
            <p className="text-gray-600">Please log in or create an account to continue.</p>
            <button
              onClick={() => dispatch(openAuthModal("login"))}
              className="inline-flex items-center gap-2 mt-6 bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl cursor-pointer"
            >
              <LogIn size={18} />
              Login / Sign Up
            </button>
          </div>
        </div>
      </StoreBackground>
    );
  }

  if (wishlistStatus === "idle" || wishlistStatus === "loading") {
    return (
      <StoreBackground className="min-h-screen">
        <StoreNavbar />
        <div className="min-h-screen flex justify-center items-center px-6">
          <SectionLoader message="Loading your wishlist..." />
        </div>
      </StoreBackground>
    );
  }

  return (
    <StoreBackground className="min-h-screen">
      <StoreNavbar />

      <div className="mx-auto px-4 sm:px-6 hero-heading pt-30 pb-8">
        {/* Heading */}
        <div className="text-center flex flex-col gap-5 pb-8">
          <div className="flex flex-wrap items-center justify-center gap-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white">
              My Wishlist
            </h1>

            <Heart
              size={42}
              className="text-red-500 fill-red-500"
            />
          </div>

          <p className="text-gray-300">
            Your favourite plants in one place.
          </p>
        </div>

        {/* Wishlist */}
        {wishlistItems.length === 0 ? (
          <div className="flex justify-center items-center min-h-[50vh]">
            <div className="bg-white border-3 border-black rounded-3xl p-14 text-center flex flex-col items-center gap-4">
              <Heart
                size={70}
                className="text-red-500 fill-red-500"
              />

              <h2 className="text-3xl font-bold text-black">
                Your Wishlist is Empty
              </h2>

              <p className="text-gray-600">
                Save the plants you love and they'll appear here.
              </p>

              <Link
                to="/Shop/ProductsListing"
                className="mt-6 bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl"
              >
                Browse Plants
              </Link>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {wishlistItems.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </StoreBackground>
  );
};

export default Wishlist;