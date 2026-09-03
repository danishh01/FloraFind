import { isDbConnected } from "../config/db.js";

// Accounts, products, cart, wishlist and orders have no meaningful
// degraded mode without persistence (unlike plant lookups, which can still
// fetch live data with caching disabled) - fail clearly instead of
// pretending to work.
export const requireDb = (req, res, next) => {
  if (!isDbConnected()) {
    return res.status(503).json({
      success: false,
      message: "This feature is temporarily unavailable. Please try again later.",
    });
  }
  next();
};

export default requireDb;
