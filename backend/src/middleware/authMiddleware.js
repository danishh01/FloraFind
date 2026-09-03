import User from "../models/User.js";
import { verifyToken } from "../utils/token.js";

// Verifies the Authorization: Bearer <token> header and attaches the
// authenticated user (without the password hash) to req.user. Every
// account-owned resource (cart, wishlist, orders) is gated behind this -
// plant/product browsing never is.
export const protect = async (req, res, next) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ success: false, message: "Please log in to continue." });
  }

  try {
    const payload = verifyToken(token);
    const user = await User.findById(payload.sub);
    if (!user) {
      return res.status(401).json({ success: false, message: "Please log in to continue." });
    }
    req.user = user;
    next();
  } catch {
    return res
      .status(401)
      .json({ success: false, message: "Your session has expired. Please log in again." });
  }
};

export default protect;
