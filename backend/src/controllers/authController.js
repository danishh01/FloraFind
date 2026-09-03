import User from "../models/User.js";
import { signToken } from "../utils/token.js";

const respondWithUser = (res, statusCode, user) => {
  res.status(statusCode).json({
    success: true,
    token: signToken(user._id.toString()),
    user: user.toSafeJSON(),
  });
};

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name?.trim() || !email?.trim() || !password) {
      const err = new Error("Name, email and password are all required.");
      err.statusCode = 400;
      throw err;
    }
    if (password.length < 6) {
      const err = new Error("Password must be at least 6 characters long.");
      err.statusCode = 400;
      throw err;
    }

    const existing = await User.findOne({ email: email.trim().toLowerCase() });
    if (existing) {
      const err = new Error("An account with this email already exists.");
      err.statusCode = 409;
      throw err;
    }

    const user = await User.create({ name: name.trim(), email: email.trim(), password });
    respondWithUser(res, 201, user);
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email?.trim() || !password) {
      const err = new Error("Email and password are required.");
      err.statusCode = 400;
      throw err;
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() }).select("+password");
    const passwordMatches = user ? await user.comparePassword(password) : false;
    if (!user || !passwordMatches) {
      const err = new Error("Invalid email or password.");
      err.statusCode = 401;
      throw err;
    }

    respondWithUser(res, 200, user);
  } catch (err) {
    next(err);
  }
};

export const me = async (req, res) => {
  res.json({ success: true, user: req.user.toSafeJSON() });
};

export default { register, login, me };
