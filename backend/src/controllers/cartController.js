import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import { serializeProduct } from "../utils/serializeProduct.js";

const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId });
  if (!cart) cart = await Cart.create({ user: userId, items: [] });
  return cart;
};

// Populates product refs and flattens each line to {..product fields,
// quantity} so the existing Cart/Checkout/Order UI (item.id/name/price/
// image/scientificName/quantity) needs no changes. Items whose product was
// deleted are silently dropped rather than crashing the response.
const serializeCart = (cart) => ({
  items: cart.items
    .filter((item) => item.product && item.product._id)
    .map((item) => ({ ...serializeProduct(item.product), quantity: item.quantity })),
});

export const getCart = async (req, res, next) => {
  try {
    const cart = await (await getOrCreateCart(req.user.id)).populate("items.product");
    res.json({ success: true, cart: serializeCart(cart) });
  } catch (err) {
    next(err);
  }
};

export const addItem = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;
    const qty = Number(quantity) || 1;
    if (!productId || qty < 1) {
      const err = new Error("A valid product and quantity are required.");
      err.statusCode = 400;
      throw err;
    }

    const product = await Product.findById(productId);
    if (!product) {
      const err = new Error("Product not found.");
      err.statusCode = 404;
      throw err;
    }
    if (!product.inStock) {
      const err = new Error("This product is currently out of stock.");
      err.statusCode = 400;
      throw err;
    }

    const cart = await getOrCreateCart(req.user.id);
    const existing = cart.items.find((item) => item.product.toString() === productId);
    if (existing) {
      existing.quantity += qty;
    } else {
      cart.items.push({ product: productId, quantity: qty });
    }
    await cart.save();
    await cart.populate("items.product");

    res.json({ success: true, cart: serializeCart(cart) });
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(404).json({ success: false, message: "Product not found." });
    }
    next(err);
  }
};

export const updateItem = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const qty = Number(req.body.quantity);
    if (!qty || qty < 1) {
      const err = new Error("Quantity must be at least 1.");
      err.statusCode = 400;
      throw err;
    }

    const cart = await getOrCreateCart(req.user.id);
    const item = cart.items.find((it) => it.product.toString() === productId);
    if (!item) {
      const err = new Error("This product is not in your cart.");
      err.statusCode = 404;
      throw err;
    }
    item.quantity = qty;
    await cart.save();
    await cart.populate("items.product");

    res.json({ success: true, cart: serializeCart(cart) });
  } catch (err) {
    next(err);
  }
};

export const removeItem = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const cart = await getOrCreateCart(req.user.id);
    cart.items = cart.items.filter((item) => item.product.toString() !== productId);
    await cart.save();
    await cart.populate("items.product");

    res.json({ success: true, cart: serializeCart(cart) });
  } catch (err) {
    next(err);
  }
};

export const clearCart = async (req, res, next) => {
  try {
    const cart = await getOrCreateCart(req.user.id);
    cart.items = [];
    await cart.save();
    res.json({ success: true, cart: { items: [] } });
  } catch (err) {
    next(err);
  }
};

export default { getCart, addItem, updateItem, removeItem, clearCart };
