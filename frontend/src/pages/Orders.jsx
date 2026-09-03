import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Package, LogIn } from "lucide-react";

import StoreBackground from "../components/StoreBackground";
import StoreNavbar from "../components/StoreNavbar";
import SectionLoader from "../components/SectionLoader";
import OrderCard from "../components/OrderCard";
import { openAuthModal, selectIsAuthenticated } from "../features/auth/authSlice";
import { fetchOrders } from "../features/order/orderSlice";

const Orders = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const orders = useSelector((state) => state.orders.orders);
  const ordersStatus = useSelector((state) => state.orders.status);

  useEffect(() => {
    if (isAuthenticated) dispatch(fetchOrders());
  }, [isAuthenticated, dispatch]);

  if (!isAuthenticated) {
    return (
      <StoreBackground className="min-h-screen hero-heading flex flex-col items-center justify-center">
        <StoreNavbar />
        <div className="bg-white border-3 border-black rounded-3xl p-14 text-center flex flex-col items-center">
          <Package size={80} className="text-green-600" />
          <h2 className="text-3xl font-bold text-black mt-6">Login to view your orders</h2>
          <p className="text-gray-600 mt-3">Please log in or create an account to continue.</p>
          <button
            onClick={() => dispatch(openAuthModal("login"))}
            className="inline-flex items-center gap-2 mt-8 bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-semibold transition cursor-pointer"
          >
            <LogIn size={18} />
            Login / Sign Up
          </button>
        </div>
      </StoreBackground>
    );
  }

  if (ordersStatus === "idle" || ordersStatus === "loading") {
    return (
      <StoreBackground className="min-h-screen flex flex-col items-center justify-center">
        <StoreNavbar />
        <SectionLoader message="Loading your orders..." />
      </StoreBackground>
    );
  }

  return (
    <StoreBackground className="min-h-screen hero-heading flex flex-col items-center justify-center">
      <StoreNavbar />

      <div className="w-full max-w-4xl flex flex-col  gap-5 mx-auto pt-32 px-4 sm:px-6 pb-16 hero-heading">
        <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">My Orders</h1>
          <Package size={45} className="text-green-400" />
        </div>

        {orders.length === 0 ? (
          <div className="min-h-[50vh] flex items-center justify-center">
            <div className="bg-white border-3 border-black rounded-3xl p-14 text-center flex flex-col items-center">
              <Package size={80} className="text-green-600" />
              <h2 className="text-3xl font-bold text-black mt-6">No Orders Yet</h2>
              <p className="text-gray-600 mt-3">Your placed orders will appear here.</p>
              <Link
                to="/Shop/ProductsListing"
                className="mt-8 bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-semibold transition"
              >
                Start Shopping
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </div>
    </StoreBackground>
  );
};

export default Orders;
