import { useSelector, useDispatch } from "react-redux";
import { ShoppingCart, LogIn } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import StoreBackground from "../components/StoreBackground";
import StoreNavbar from "../components/StoreNavbar";
import SectionLoader from "../components/SectionLoader";
import CartItemRow from "../components/CartItemRow";

import { clearCart } from "../features/cart/cartSlice";
import { openAuthModal, selectIsAuthenticated } from "../features/auth/authSlice";

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isAuthenticated = useSelector(selectIsAuthenticated);
  const cartItems = useSelector((state) => state.cart.cartItems);
  const cartStatus = useSelector((state) => state.cart.status);

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const delivery = 0;
  const total = subtotal + delivery;

  if (!isAuthenticated) {
    return (
      <StoreBackground className="min-h-screen">
        <StoreNavbar />
        <div className="min-h-screen flex justify-center items-center px-6">
          <div className="bg-white border-3 border-black flex flex-col rounded-3xl p-14 text-center items-center gap-4 hero-heading">
            <ShoppingCart className="mx-auto text-green-600" size={70} />
            <h2 className="text-3xl font-bold text-black mt-5">Login to view your cart</h2>
            <p className="text-gray-600 mt-3">Please log in or create an account to continue.</p>
            <button
              onClick={() => dispatch(openAuthModal("login"))}
              className="inline-flex items-center gap-2 mt-8 bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl cursor-pointer"
            >
              <LogIn size={18} />
              Login / Sign Up
            </button>
          </div>
        </div>
      </StoreBackground>
    );
  }

  if (cartStatus === "idle" || cartStatus === "loading") {
    return (
      <StoreBackground className="min-h-screen">
        <StoreNavbar />
        <div className="min-h-screen flex justify-center items-center px-6">
          <SectionLoader message="Loading your cart..." />
        </div>
      </StoreBackground>
    );
  }

  return (
    <StoreBackground className="min-h-screen">
      <StoreNavbar />

      <div className=" mx-auto pt-32 px-6 pb-10 flex flex-col items-center justify-center hero-heading">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-10 pb-10 flex items-center gap-3">
          Shopping Cart
          <ShoppingCart size={50} />
        </h1>

        {cartItems.length === 0 ? (
          <div className="flex justify-center  items-center min-h-[50vh]">
            <div className="bg-white border-3 border-black flex flex-col rounded-3xl p-14 text-center items-center gap-4">
              <ShoppingCart className="mx-auto text-green-600" size={70} />
              <h2 className="text-3xl font-bold text-black mt-5">Your Cart is Empty</h2>
              <p className="text-gray-600 mt-3">Start shopping and add your favourite plants</p>
              <Link
                to="/Shop/ProductsListing"
                className="inline-block mt-8 bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 gap-5 flex flex-col">
              {cartItems.map((item) => (
                <CartItemRow key={item.id} item={item} />
              ))}
            </div>

            {/* Summary */}
            <div className="bg-white border-3 border-black rounded-3xl p-6 h-fit lg:sticky lg:top-32">
              <h2 className="text-3xl font-bold text-black mb-8">Order Summary</h2>

              <div className="space-y-5 text-lg">
                <div className="flex justify-between text-gray-700">
                  <span>Total Items</span>
                  <span className="font-montenegrin">{totalItems}</span>
                </div>

                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span className="font-montenegrin">₹ {subtotal}</span>
                </div>

                <div className="flex justify-between text-gray-700">
                  <span>Delivery</span>
                  <span className="text-green-600">Free</span>
                </div>

                <hr className="border-black/20" />

                <div className="flex justify-between text-2xl font-bold text-black">
                  <span>Total</span>
                  <span className="font-montenegrin">₹ {total}</span>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={() => navigate("/Shop/Checkout")}
                  className="w-full mt-8 bg-green-600 cursor-pointer hover:bg-green-700 py-3 rounded-xl text-white font-semibold"
                >
                  Proceed to Checkout
                </button>

                <button
                  onClick={() => dispatch(clearCart())}
                  className="w-full mt-4 border-2 border-red-600 cursor-pointer text-red-600 hover:bg-red-600 hover:text-white py-3 rounded-xl"
                >
                  Clear Cart
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </StoreBackground>
  );
};

export default Cart;
