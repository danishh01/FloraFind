import Product from "../models/Product.js";
import { serializeProduct } from "../utils/serializeProduct.js";

export const getProducts = async (req, res, next) => {
  try {
    const { category, search } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (search) filter.name = { $regex: search.trim(), $options: "i" };

    const products = await Product.find(filter).sort({ createdAt: 1 });
    res.json({ success: true, products: products.map(serializeProduct) });
  } catch (err) {
    next(err);
  }
};

export const getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      const err = new Error("Product not found.");
      err.statusCode = 404;
      throw err;
    }
    res.json({ success: true, product: serializeProduct(product) });
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(404).json({ success: false, message: "Product not found." });
    }
    next(err);
  }
};

export default { getProducts, getProduct };
