import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Heart, ShoppingCart, Minus, Plus } from "lucide-react";
import StoreBackground from "../components/StoreBackground";
import StoreNavbar from "../components/StoreNavbar";
import SectionLoader from "../components/SectionLoader";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../features/cart/cartSlice";
import { toggleWishlist } from "../features/wishlist/wishlistSlice";
import { openAuthModal, selectIsAuthenticated } from "../features/auth/authSlice";
import { getProduct } from "../api/productApi";
import { ApiError } from "../api/client";

const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const wishlistItems = useSelector((state) => state.wishlist.wishlistItems);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    let cancelled = false;
    getProduct(id)
      .then((data) => {
        if (!cancelled) setProduct(data);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof ApiError ? err.message : "Product not found.");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  const requireAuth = () => {
    if (isAuthenticated) return true;
    dispatch(openAuthModal("login"));
    return false;
  };

  const handleAddToCart = () => {
    if (!requireAuth()) return;
    dispatch(addToCart({ productId: product.id, quantity }));
  };

  const handleWishlist = () => {
    if (!requireAuth()) return;
    dispatch(toggleWishlist(product));
  };

  if (loading) {
    return (
      <StoreBackground className="min-h-screen flex items-center justify-center">
        <StoreNavbar />
        <div className="w-full px-4 pt-28 sm:pt-32 pb-10 flex justify-center">
          <SectionLoader message="Loading product details..." />
        </div>
      </StoreBackground>
    );
  }

  if (error || !product) {
    return (
      <StoreBackground className="min-h-screen flex justify-center items-center">
        <h1 className="text-4xl text-white font-bold">{error || "Product Not Found"}</h1>
      </StoreBackground>
    );
  }

  const isWishlisted = wishlistItems.some((item) => item.id === product.id);

  return (
    <StoreBackground className="min-h-screen flex items-center justify-center">
      <StoreNavbar />
      <div className="max-w-6xl mx-auto pt-28 sm:pt-32 flex items-center px-4 sm:px-6">
        <div className="grid md:grid-cols-2 gap-6 sm:gap-10 bg-white border-3 border-black rounded-3xl p-5 sm:p-8">
          <img
            src={product.image || "/indoor.png"}
            alt={product.name}
            className="w-full max-w-[400px] mx-auto object-cover rounded-3xl"
          />
          <div className="text-black flex flex-col gap-3">
            <h1 className="text-3xl sm:text-4xl font-bold">{product.name}</h1>
            <p className="italic text-gray-600 mt-2">{product.scientificName}</p>
            <h2 className="text-3xl font-bold text-green-600 mt-5">
              <span className="font-montenegrin">₹{product.price}</span>
            </h2>
            <p className={`mt-2 font-semibold ${product.inStock ? "text-green-600" : "text-red-600"}`}>
              {product.inStock ? "In Stock" : "Out of Stock"}
            </p>
            <div className="flex items-center gap-5 mt-6">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="bg-white text-black rounded-full p-2"
              >
                <Minus size={16} />
              </button>
              <span className="text-xl font-montenegrin">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="bg-white text-black rounded-full p-2"
              >
                <Plus size={16} />
              </button>
            </div>
            <h3 className="text-xl font-semibold mt-8 mb-3">Benefits</h3>
            <ul className="space-y-2 text-gray-700">
              {(product.benefits || []).map((benefit, index) => (
                <li key={index}>🌿 {benefit}</li>
              ))}
            </ul>
            <div className="flex gap-4 mt-8">
              <button
                onClick={handleWishlist}
                className={`border-2 cursor-pointer rounded-xl p-3 hover:bg-gray-100 transition ${
                  isWishlisted ? "text-red-500 border-red-500" : "text-red-700 border-black"
                }`}
              >
                <Heart className={isWishlisted ? "fill-red-500" : ""} />
              </button>
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className={`flex-1 flex justify-center items-center gap-2 rounded-xl py-3 font-semibold transition ${
                  product.inStock ? "bg-green-600 hover:bg-green-700" : "bg-gray-500 cursor-not-allowed"
                }`}
              >
                <ShoppingCart size={20} />
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </StoreBackground>
  );
};
export default ProductDetails;
