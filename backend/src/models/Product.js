import mongoose from "mongoose";

const PRODUCT_CATEGORIES = ["indoor", "outdoor", "seeds-fertilizers", "pots-accessories"];

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    scientificName: { type: String, trim: true },
    category: { type: String, enum: PRODUCT_CATEGORIES, required: true, index: true },
    image: { type: String, default: "" },
    price: { type: Number, required: true, min: 0 },
    rating: { type: Number, min: 0, max: 5, default: 0 },
    reviews: { type: Number, min: 0, default: 0 },
    inStock: { type: Boolean, default: true },
    benefits: { type: [String], default: [] },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
