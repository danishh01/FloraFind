import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
// A plain localStorage-backed engine (the same shape redux-persist's own
// createWebStorage produces) instead of importing "redux-persist/lib/storage"
// directly - that CJS module's default export comes through unwrapped when
// Vite pre-bundles it, breaking storage.getItem/.setItem at runtime.
const storage = {
  getItem: (key) => Promise.resolve(window.localStorage.getItem(key)),
  setItem: (key, value) => {
    window.localStorage.setItem(key, value);
    return Promise.resolve();
  },
  removeItem: (key) => {
    window.localStorage.removeItem(key);
    return Promise.resolve();
  },
};

import authReducer from "../features/auth/authSlice";
import cartReducer from "../features/cart/cartSlice";
import wishlistReducer from "../features/wishlist/wishlistSlice";
import orderReducer from "../features/order/orderSlice";

// Only auth (the JWT + user) is persisted across refreshes - cart/wishlist/
// orders are always re-hydrated from the backend for the logged-in user
// (see main.jsx), so persisting them locally too would just risk stale/
// duplicated state.
const authPersistConfig = { key: "auth", storage, whitelist: ["user", "token"] };

const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
  cart: cartReducer,
  wishlist: wishlistReducer,
  orders: orderReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
