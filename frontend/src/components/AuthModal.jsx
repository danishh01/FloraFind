import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { X } from "lucide-react";
import {
  closeAuthModal,
  loginUser,
  registerUser,
} from "../features/auth/authSlice";

// Single global login/register surface, reused everywhere a logged-out
// user tries to do something account-specific (navbar, cart, wishlist,
// checkout, orders). Styled with the same dark glass-card look and the
// existing `.checkout-input` class used by Checkout.jsx.
const AuthModal = () => {
  const dispatch = useDispatch();
  const { isAuthModalOpen, authModalMode, status, error } = useSelector(
    (state) => state.auth,
  );
  const [mode, setMode] = useState(authModalMode);
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  if (!isAuthModalOpen) return null;

  const loading = status === "loading";

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mode === "login") {
      dispatch(loginUser({ email: form.email, password: form.password }));
    } else {
      dispatch(registerUser(form));
    }
  };

  const switchMode = (nextMode) => {
    setMode(nextMode);
    setForm({ name: "", email: "", password: "" });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
      <div className="relative w-full max-w-md rounded-3xl border-3 border-white bg-black p-6 sm:p-8 shadow-2xl hero-heading">
        <button
          type="button"
          onClick={() => dispatch(closeAuthModal())}
          className="absolute right-5 top-5 text-white/70 hover:text-green-500 cursor-pointer"
          aria-label="Close"
        >
          <X />
        </button>

        <div className="flex items-center font-montenegrin gap-3 mb-6">
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            {mode === "login" ? "Login" : "Create Account"}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="flex font-montenegrin flex-col gap-2">
          {mode === "register" && (
            <input
              required
              type="text"
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              className="checkout-input"
            />
          )}
          <input
            required
            type="email"
            name="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
            className="checkout-input"
          />
          <input
            required
            type="password"
            name="password"
            placeholder="Password"
            minLength={6}
            value={form.password}
            onChange={handleChange}
            className="checkout-input"
          />

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full rounded-xl bg-green-600 py-3 font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading
              ? "Please wait..."
              : mode === "login"
                ? "Login"
                : "Sign Up"}
          </button>
        </form>

        <p className="mt-6 text-center font-montenegrin text-sm text-gray-400">
          {mode === "login"
            ? "Don't have an account?"
            : "Already have an account?"}{" "}
          <button
            type="button"
            onClick={() => switchMode(mode === "login" ? "register" : "login")}
            className="text-green-500 hover:text-green-400 cursor-pointer font-semibold"
          >
            {mode === "login" ? "Sign Up" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthModal;
