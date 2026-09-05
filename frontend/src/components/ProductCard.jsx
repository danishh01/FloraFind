import { Heart, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggleWishlist } from "../features/wishlist/wishlistSlice";
import { addToCart } from "../features/cart/cartSlice";
import { openAuthModal, selectIsAuthenticated } from "../features/auth/authSlice";

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const wishlistItems = useSelector((state) => state.wishlist.wishlistItems);
  const isWishlisted = wishlistItems.some((item) => item.id === product.id);

  const requireAuth = () => {
    if (isAuthenticated) return true;
    dispatch(openAuthModal("login"));
    return false;
  };

  const handleAddToCart = () => {
    if (!requireAuth()) return;
    dispatch(addToCart({ productId: product.id, quantity: 1 }));
    alert(`${product.name} added to cart`);
  };
  const handleWishlist = () => {
    if (!requireAuth()) return;
    dispatch(toggleWishlist(product));
  };

  return (
    <div className="bg-white border-3 border-black rounded-2xl hero-heading overflow-hidden shadow-lg hover:scale-105 hover:shadow-2xl transition-all duration-300">

      {/* Product Image */}
      <div className="relative">
        <img
          src={product.image || "/indoor.png"}
          alt={product.name}
          loading="lazy"
          className="w-full h-64 object-cover"
        />

        {/* Wishlist */}
        <button
          onClick={handleWishlist}
          className="absolute top-3 right-3 bg-white/70 backdrop-blur-md p-2 rounded-full hover:bg-white cursor-pointer"
        >
          <Heart
            size={18}
            className={isWishlisted ? "fill-red-500 text-red-500" : "text-gray-600 hover:text-red-500"}
          />
        </button>
      </div>

      {/* Product Details */}
      <div className="p-5">

        <h2 className="text-2xl font-bold text-black">
          {product.name}
        </h2>

        <h3 className="text-green-600 text-2xl font-bold mt-4">
          <span className="font-montenegrin">₹{product.price}</span>
        </h3>

        <p
          className={`mt-2 font-semibold ${
            product.inStock
              ? "text-green-600"
              : "text-red-600"
          }`}
        >
          {product.inStock ? "In Stock" : "Out of Stock"}
        </p>

        <div className="flex gap-3 mt-5">

          <Link
            to={`/Shop/Product/${product.id}`}
            className="flex-1 border text-center border-green-500 text-green-400 py-2 rounded-lg hover:bg-green-500 hover:text-white transition"
          >
            Know More
          </Link>

          <button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className={`flex items-center justify-center cursor-pointer gap-2 flex-1 py-2 rounded-lg transition ${
              product.inStock
                ? "bg-green-600 hover:bg-green-700 text-white"
                : "bg-gray-500 text-gray-300 cursor-not-allowed"
            }`}
          >
            <ShoppingCart size={18} />
            Cart
          </button>

        </div>

      </div>
    </div>
  );
};

export default ProductCard;
