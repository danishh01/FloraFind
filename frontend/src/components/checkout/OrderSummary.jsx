const OrderSummary = ({
  cartItems,
  totalItems,
  subtotal,
  deliveryCharge,
  total,
  orderError,
  placingOrder,
  paymentMethod,
}) => (
  <div className="bg-white border-3 border-black rounded-3xl p-7 h-fit lg:sticky lg:top-32">
    <h2 className="text-3xl font-bold text-black mb-7">Order Summary</h2>

    <div className="gap-2 flex flex-col pb-2">
      {cartItems.map((item) => (
        <div key={item.id} className="flex items-center gap-4">
          <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover" />
          <div className="flex-1">
            <h3 className="text-black font-semibold">{item.name}</h3>
            <p className="text-gray-500 text-sm">
              Qty: <span className="font-montenegrin">{item.quantity}</span>
            </p>
            <span className="text-black font-semibold font-montenegrin">
              ₹{item.price * item.quantity}
            </span>
          </div>
        </div>
      ))}
    </div>

    <hr className="border-black/20 my-6" />

    <div className="space-y-4 text-gray-700">
      <div className="flex justify-between">
        <span>Items</span>
        <span className="font-montenegrin">{totalItems}</span>
      </div>
      <div className="flex justify-between">
        <span>Subtotal</span>
        <span className="font-montenegrin">₹{subtotal}</span>
      </div>
      <div className="flex justify-between">
        <span>Delivery</span>
        <span>
          {deliveryCharge === 0 ? "FREE" : <span className="font-montenegrin">₹{deliveryCharge}</span>}
        </span>
      </div>
      <hr className="border-black/20" />
      <div className="flex justify-between text-2xl font-bold text-black">
        <span>Total</span>
        <span className="font-montenegrin">₹{total}</span>
      </div>
    </div>

    {orderError && <p className="text-red-600 text-sm text-center mt-4">{orderError}</p>}

    <button
      type="submit"
      disabled={placingOrder}
      className="w-full mt-8 bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl font-bold text-lg transition cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
    >
      {placingOrder
        ? paymentMethod === "razorpay"
          ? "Processing Payment..."
          : "Placing Order..."
        : paymentMethod === "razorpay"
          ? `Pay ₹${total} with Razorpay`
          : "Place Order"}
    </button>
  </div>
);

export default OrderSummary;
