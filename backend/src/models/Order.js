import mongoose from "mongoose";

// Snapshot of each product at order time - name/price/image/scientificName
// are copied in rather than populated live, so an order still displays
// correctly even if the underlying product later changes or is removed.
const orderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    name: String,
    scientificName: String,
    image: String,
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const ORDER_STATUSES = ["Confirmed", "Packed", "Shipped", "Out for Delivery", "Delivered", "Cancelled"];

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    orderNumber: { type: String, required: true, unique: true },

    items: { type: [orderItemSchema], default: [] },

    customer: {
      name: String,
      phone: String,
      email: String,
    },
    address: {
      house: String,
      street: String,
      city: String,
      state: String,
      pincode: String,
    },

    deliveryMethod: { type: String, enum: ["standard", "express"], default: "standard" },
    paymentMethod: {
      type: String,
      enum: ["cod", "upi", "card", "netbanking"],
      default: "cod",
    },

    totalItems: { type: Number, required: true },
    subtotal: { type: Number, required: true },
    deliveryCharge: { type: Number, required: true, default: 0 },
    total: { type: Number, required: true },

    status: { type: String, enum: ORDER_STATUSES, default: "Confirmed" },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
