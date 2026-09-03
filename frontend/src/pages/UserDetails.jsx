import { Mail, UserRound, LogOut, ShoppingBag, Heart } from "lucide-react";
import { Link, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import BackgroundSection from "../components/BackgroundSection.jsx";
import { logout, selectIsAuthenticated } from "../features/auth/authSlice";

const UserDetails = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector((state) => state.auth.user);

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <BackgroundSection className="border-[5px] border-white min-h-screen rounded-3xl">
      <section className="px-4 sm:px-10 pt-28 sm:pt-32 pb-10 min-h-screen flex items-center justify-center">

        <div className="w-full max-w-2xl bg-black border-3 border-white backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-xl">

          <h1 className="text-3xl sm:text-4xl text- font-black text-white mb-10">
            Account
          </h1>

          <div className="space-y-7 py-2 text-lg">

            <div className="flex items-center gap-5">
              <UserRound className="text-white" />

              <div>
                <p className="text-sm text-gray-500">
                  Name
                </p>

                <p className="text-white">
                  {user?.name}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-5">
              <Mail className="text-white" />

              <div>
                <p className="text-sm text-gray-500">
                  Email
                </p>

                <p className="text-white">
                  {user?.email}
                </p>
              </div>
            </div>

          </div>

          <div className="py-2 flex flex-col sm:flex-row sm:justify-between gap-3">
            <Link
              to="/Shop/Orders"
              className="flex items-center justify-center gap-2 rounded-xl border border-white px-5 py-3 text-white transition-colors hover:text-green-500"
            >
              <ShoppingBag size={18} />
              My Orders
            </Link>

            <Link
              to="/Shop/Wishlist"
              className="flex items-center justify-center gap-2 rounded-xl border border-white px-5 py-3 text-white transition-colors hover:text-green-500"
            >
              <Heart size={18} />
              My Wishlist
            </Link>

            <button
              type="button"
              onClick={() => dispatch(logout())}
              className="flex items-center justify-center gap-2 rounded-xl border border-red-400 px-5 py-3 text-red-400 transition-colors hover:bg-red-500 hover:text-white cursor-pointer"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>

        </div>

      </section>
    </BackgroundSection>
  );
};

export default UserDetails;
