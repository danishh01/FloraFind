import React from "react";
import { CheckCircle, Package, Truck, XCircle, Clock } from "lucide-react";

const ORDER_STATUSES = ["Confirmed", "Packed", "Shipped", "Out for Delivery", "Delivered"];

const getStatusIcon = (status) => {
  switch (status) {
    case "Confirmed":
      return <CheckCircle size={18} />;
    case "Packed":
      return <Package size={18} />;
    case "Shipped":
      return <Truck size={18} />;
    case "Out for Delivery":
      return <Truck size={18} />;
    case "Delivered":
      return <CheckCircle size={18} />;
    case "Cancelled":
      return <XCircle size={18} />;
    default:
      return <Clock size={18} />;
  }
};

// One order card: header, product list, status timeline, and address.
const OrderCard = ({ order }) => {
  const currentIndex = ORDER_STATUSES.indexOf(order.status);

  return (
    <div className="bg-white border-3 border-black rounded-3xl p-7 shadow-xl">
      {/* Order Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-black/20 pb-5">
        <div>
          <p className="text-gray-500 text-sm">Order ID</p>
          <h2 className="text-xl text-black">
            <span className="font-montenegrin">{order.id}</span>
          </h2>
        </div>
        <div>
          <p className="text-gray-500 text-sm">Order Date</p>
          <p className="text-black font-montenegrin">{order.date}</p>
        </div>
        <div>
          <p className="text-gray-500 text-sm">Payment</p>
          <p className="text-black capitalize">{order.paymentMethod}</p>
        </div>
        <div>
          <p className="text-gray-500 text-sm">Total</p>
          <p className="text-xl font-bold text-green-600">
            <span className="font-montenegrin">₹{order.total}</span>
          </p>
        </div>
      </div>

      {/* Products */}
      <div className="mt-6 space-y-4">
        {order.items.map((item) => (
          <div key={item.id} className="flex items-center gap-4 bg-gray-50 rounded-2xl p-4">
            <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-xl" />
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

      {/* Status Timeline */}
      <div className="mt-8">
        <h3 className="text-xl font-bold text-black mb-6">Order Status</h3>
        <div className="flex items-center justify-between">
          {ORDER_STATUSES.map((status, index) => {
            const completed = index <= currentIndex;

            return (
              <React.Fragment key={status}>
                <div className="flex flex-col items-center text-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      completed ? "bg-green-600 text-white" : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {getStatusIcon(status)}
                  </div>
                  <span className={`text-xs mt-2 max-w-20 ${completed ? "text-green-600" : "text-gray-500"}`}>
                    {status}
                  </span>
                </div>

                {index < ORDER_STATUSES.length - 1 && (
                  <div className={`h-1 flex-1 mx-2 ${index < currentIndex ? "bg-green-600" : "bg-gray-200"}`} />
                )}
              </React.Fragment>
            );
          })}
        </div>
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
