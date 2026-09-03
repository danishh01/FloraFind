import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { CheckCircle, Package, ShoppingBag, ArrowRight } from "lucide-react";

import StoreBackground from "../components/StoreBackground";
import StoreNavbar from "../components/StoreNavbar";

const OrderSuccess = () => {
  const location = useLocation();

  // Only used as a fallback if this page is opened without an order (e.g.
  // a refresh) - generated once via lazy useState so it can't change on
  // re-render (React requires render to be pure; Math.random() isn't).
  const [fallbackOrderId] = useState(
    () => "FF-" + Math.floor(100000 + Math.random() * 900000)
  );
  const orderId = location.state?.orderId || fallbackOrderId;
  const total = location.state?.total || 0;

  return (
    <StoreBackground className="min-h-screen">
      <StoreNavbar />

      <div className="min-h-screen flex flex-col items-center justify-center px-6 pt-30 pb-10">
        <div className="max-w-3xl">
          <div className="bg-white border-3 border-black rounded-3xl p-10 md:p-14 text-center hero-heading shadow-2xl">
            {/* Success Icon */}
            <div className="flex justify-center">
              <div className="bg-green-100 rounded-full p-5">
                <CheckCircle size={40} className="text-green-600" />
              </div>
            </div>

            {/* Heading */}
            <h1 className="text-4xl md:text-5xl font-bold text-black mt-7">
              Order Placed Successfully!
            </h1>
            <p className="text-gray-600 text-lg mt-4">Thank you for shopping with FloraFind.</p>

            {/* Order Details */}
            <div className="bg-gray-50 border-2 border-black rounded-2xl p-6 mt-8 text-left">
              <div className="flex justify-between items-center border-b border-black/20 pb-4">
                <div>
                  <p className="text-gray-500 text-sm">Order ID</p>
                  <p className="text-black font-semibold mt-1">{orderId}</p>
                </div>
                <Package className="text-green-600" />
              </div>

              <div className="flex justify-between mt-5">
                <span className="text-gray-600">Order Status</span>
                <span className="text-green-600 font-semibold">Confirmed</span>
              </div>

              <div className="flex justify-between mt-4">
                <span className="text-gray-600">Payment Status</span>
                <span className="text-green-600 font-semibold">Pending</span>
              </div>

              <div className="flex justify-between mt-4">
                <span className="text-gray-600">Total Amount</span>
                <span className="text-black font-bold font-montenegrin">₹{total}</span>
              </div>
            </div>

            {/* Delivery */}
            <div className="mt-8">
              <p className="text-gray-600">Estimated Delivery</p>
              <p className="text-xl font-bold text-black mt-2">
                <span className="font-montenegrin">3–5</span> Business Days
              </p>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-10">
              <Link
                to="/Shop"
                className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold transition"
              >
                <ShoppingBag size={20} />
                Continue Shopping
              </Link>

              <Link
                to="/Shop/Orders"
                className="flex-1 flex items-center justify-center gap-2 border-2 border-black text-black hover:bg-gray-100 py-3 rounded-xl font-semibold transition"
              >
                View My Orders
                <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </StoreBackground>
  );
};

export default OrderSuccess;
