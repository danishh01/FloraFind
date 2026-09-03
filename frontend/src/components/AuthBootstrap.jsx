import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RouterProvider } from "react-router-dom";

import { fetchCurrentUser, selectIsAuthenticated } from "../features/auth/authSlice";
import { fetchCart, resetCart } from "../features/cart/cartSlice";
import { fetchWishlist, resetWishlist } from "../features/wishlist/wishlistSlice";
import { resetOrders } from "../features/order/orderSlice";
import AuthModal from "./AuthModal";
import Chatbot from "./chatbot/Chatbot";

// Runs once at startup to verify any persisted token is still valid, then
// keeps cart/wishlist hydrated from the backend for as long as the user
// stays logged in - and clears them immediately on logout so nothing from
// the previous account lingers in the UI.
const AuthBootstrap = ({ router }) => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  useEffect(() => {
    if (token) dispatch(fetchCurrentUser());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCart());
      dispatch(fetchWishlist());
    } else {
      dispatch(resetCart());
      dispatch(resetWishlist());
      dispatch(resetOrders());
    }
  }, [isAuthenticated, dispatch]);

  return (
    <>
      <AuthModal />
      <Chatbot />
      <RouterProvider router={router} />
    </>
  );
};

export default AuthBootstrap;
