import Wishlist from "../models/Wishlist.js";
import Product from "../models/Product.js";
import { serializeProduct } from "../utils/serializeProduct.js";

const getOrCreateWishlist = async (userId) => {
  let wishlist = await Wishlist.findOne({ user: userId });
  if (!wishlist) wishlist = await Wishlist.create({ user: userId, products: [] });
  return wishlist;
};

const serializeWishlist = (wishlist) => ({
  products: wishlist.products.filter(Boolean).map(serializeProduct),
});

export const getWishlist = async (req, res, next) => {
  try {
    const wishlist = await (await getOrCreateWishlist(req.user.id)).populate("products");
    res.json({ success: true, wishlist: serializeWishlist(wishlist) });
  } catch (err) {
    next(err);
  }
};

export const addProduct = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const product = await Product.findById(productId);
    if (!product) {
      const err = new Error("Product not found.");
      err.statusCode = 404;
      throw err;
    }

    const wishlist = await getOrCreateWishlist(req.user.id);
    if (!wishlist.products.some((id) => id.toString() === productId)) {
      wishlist.products.push(productId);
      await wishlist.save();
    }
    await wishlist.populate("products");

    res.json({ success: true, wishlist: serializeWishlist(wishlist) });
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(404).json({ success: false, message: "Product not found." });
    }
    next(err);
  }
};

export const removeProduct = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const wishlist = await getOrCreateWishlist(req.user.id);
    wishlist.products = wishlist.products.filter((id) => id.toString() !== productId);
    await wishlist.save();
    await wishlist.populate("products");

    res.json({ success: true, wishlist: serializeWishlist(wishlist) });
  } catch (err) {
    next(err);
  }
};

export default { getWishlist, addProduct, removeProduct };
