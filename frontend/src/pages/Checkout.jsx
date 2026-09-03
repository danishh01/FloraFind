import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag, LogIn } from "lucide-react";

import StoreBackground from "../components/StoreBackground";
import StoreNavbar from "../components/StoreNavbar";
import CustomerForm from "../components/checkout/CustomerForm";
import AddressForm from "../components/checkout/AddressForm";
import DeliveryOptions from "../components/checkout/DeliveryOptions";
import PaymentOptions from "../components/checkout/PaymentOptions";
import OrderSummary from "../components/checkout/OrderSummary";

import { placeOrder } from "../features/order/orderSlice";
import { openAuthModal, selectIsAuthenticated } from "../features/auth/authSlice";

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isAuthenticated = useSelector(selectIsAuthenticated);
  const cartItems = useSelector((state) => state.cart.cartItems);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [orderError, setOrderError] = useState(null);

  const [deliveryMethod, setDeliveryMethod] = useState("standard");
  const [paymentMethod, setPaymentMethod] = useState("cod");

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    house: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
  });

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryCharge = deliveryMethod === "express" ? 99 : 0;
  const total = subtotal + deliveryCharge;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      alert("Your cart is empty");
      return;
    }

    setOrderError(null);
    setPlacingOrder(true);
    try {
      const order = await dispatch(
        placeOrder({
          customer: {
            name: formData.name,
            phone: formData.phone,
            email: formData.email,
          },
          address: {
            house: formData.house,
            street: formData.street,
            city: formData.city,
            state: formData.state,
            pincode: formData.pincode,
          },
          deliveryMethod,
          paymentMethod,
        })
      ).unwrap();

      navigate("/Shop/OrderSuccess", {
        state: { orderId: order.id, total: order.total },
      });
    } catch (err) {
      setOrderError(typeof err === "string" ? err : "Could not place your order. Please try again.");
    } finally {
      setPlacingOrder(false);
    }
  };

  // Must be logged in to check out
  if (!isAuthenticated) {
    return (
      <StoreBackground className="min-h-screen">
        <StoreNavbar />
        <div className="min-h-screen flex flex-col items-center justify-center text-white hero-heading px-6">
          <ShoppingBag size={70} className="text-green-400" />
          <h1 className="text-4xl font-bold mt-6">Login to check out</h1>
          <p className="text-gray-300 mt-3">Please log in or create an account to continue.</p>
          <button
            onClick={() => dispatch(openAuthModal("login"))}
            className="inline-flex items-center gap-2 mt-8 bg-green-600 hover:bg-green-700 px-8 py-3 rounded-xl cursor-pointer"
          >
            <LogIn size={18} />
            Login / Sign Up
          </button>
        </div>
      </StoreBackground>
    );
  }

  // If cart is empty
  if (cartItems.length === 0) {
    return (
      <StoreBackground className="min-h-screen">
        <StoreNavbar />
        <div className="min-h-screen flex flex-col items-center justify-center text-white hero-heading">
          <ShoppingBag size={70} className="text-green-400" />
          <h1 className="text-4xl font-bold mt-6">Your Cart is Empty</h1>
          <p className="text-gray-300 mt-3">Add some products before proceeding to checkout.</p>
          <Link to="/Shop/ProductsListing" className="mt-8 bg-green-600 hover:bg-green-700 px-8 py-3 rounded-xl">
            Continue Shopping
          </Link>
        </div>
      </StoreBackground>
    );
  }

  return (
    <StoreBackground className="min-h-screen flex flex-col items-center justify-center hero-heading">
      <StoreNavbar />

      <form
        onSubmit={handlePlaceOrder}
        className="max-w-7xl mx-auto pt-32 pb-12 flex flex-col gap-5 px-6 hero-heading"
      >
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white text-center mb-12">
          Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 flex flex-col gap-5 space-y-8">
            <CustomerForm formData={formData} handleChange={handleChange} />
            <AddressForm formData={formData} handleChange={handleChange} />
            <DeliveryOptions deliveryMethod={deliveryMethod} setDeliveryMethod={setDeliveryMethod} />
            <PaymentOptions paymentMethod={paymentMethod} setPaymentMethod={setPaymentMethod} />
          </div>

          <OrderSummary
            cartItems={cartItems}
            totalItems={totalItems}
            subtotal={subtotal}
            deliveryCharge={deliveryCharge}
            total={total}
            orderError={orderError}
            placingOrder={placingOrder}
          />
        </div>
      </form>
    </StoreBackground>
  );
};

export default Checkout;
