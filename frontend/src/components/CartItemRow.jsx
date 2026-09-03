import { Minus, Plus, Trash2 } from "lucide-react";
import { useDispatch } from "react-redux";
import { increaseQuantity, decreaseQuantity, removeFromCart } from "../features/cart/cartSlice";

const CartItemRow = ({ item }) => {
  const dispatch = useDispatch();

  return (
    <div className="bg-white border-3 border-black rounded-3xl p-5 flex flex-col sm:flex-row gap-4 sm:justify-between sm:items-center">
      <div className="flex gap-5">
        <img src={item.image} alt={item.name} className="w-28 h-28 rounded-2xl object-cover" />

        <div>
          <h2 className="text-2xl font-semibold text-black">{item.name}</h2>
          <p className="text-gray-600 italic">{item.scientificName}</p>

          <div className="flex items-center gap-4 mt-4">
            <button
              onClick={() => dispatch(decreaseQuantity(item.id))}
              className="bg-black text-white p-2 cursor-pointer rounded-full"
            >
              <Minus size={16} />
            </button>

            <span className="text-black font-bold font-montenegrin">{item.quantity}</span>

            <button
              onClick={() => dispatch(increaseQuantity(item.id))}
              className="bg-black text-white p-2 cursor-pointer rounded-full"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>
      </div>

      <div className="text-left sm:text-right">
        <h2 className="text-2xl text-black font-bold">
          <span className="font-montenegrin">₹ {item.price * item.quantity}</span>
        </h2>

        <button
          onClick={() => dispatch(removeFromCart(item.id))}
          className="mt-5 text-red-600 hover:text-red-700 flex items-center gap-2 cursor-pointer"
        >
          <Trash2 size={18} />
          Remove
        </button>
      </div>
    </div>
  );
};

export default CartItemRow;
