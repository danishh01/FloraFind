
// One order card: header, product list, status timeline, and address.
const OrderCard = ({ order }) => {

  return (
    <div className="bg-white border-3 border-black rounded-3xl p-7 shadow-xl">
      {/* Order Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-black/20 pb-5">
        <div>
          <p className="text-black font-black text-sm">Order ID</p>
          <h2 className="text-gray-700">
            <span className="font-montenegrin">{order.id}</span>
          </h2>
        </div>
        <div>
          <p className="text-black font-black text-sm">Order Date</p>
          <p className="text-gray-700 font-montenegrin">{order.date}</p>
        </div>
        <div>
          <p className="text-black font-black text-sm">Payment</p>
          <p className="text-gray-700 font-montenegrin">{order.paymentMethod}</p>
        </div>
        <div>
          <p className="text-black font-black text-sm">Total</p>
          <p className="text-xl font-bold text-green-600">
            <span className="font-montenegrin">₹{order.total}</span>
          </p>
        </div>
      </div>

      {/* Products */}
      <div className="mt-6 space-y-4">
        {order.items.map((item) => (
          <div key={item.id} className="flex items-center gap-4 bg-gray-50 rounded-2xl p-4">
            <img src={item.image} alt={item.name} loading="lazy" className="w-20 h-20 object-cover rounded-xl" />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-black">{item.name}</h3>
              <p className="text-gray-500 text-sm">{item.scientificName}</p>
              <p className="text-gray-600 mt-1">
                Quantity: <span className="font-montenegrin">{item.quantity}</span>
              </p>
            </div>
            <p className="text-black font-semibold">
              <span className="font-montenegrin">₹{item.price * item.quantity}</span>
            </p>
          </div>
        ))}
      </div>


      {/* Address */}
      <div className="mt-8 bg-gray-50 rounded-2xl p-5">
        <h3 className="text-lg font-bold text-black mb-3">Delivery Address</h3>
        <p className="text-gray-600 font-montenegrin">
          {order.address.house}, {order.address.street}, {order.address.city}, {order.address.state} -{" "}
          {order.address.pincode}
        </p>
      </div>
    </div>
  );
};

export default OrderCard;
