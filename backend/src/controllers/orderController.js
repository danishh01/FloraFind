import Cart from "../models/Cart.js";
import Order from "../models/Order.js";

const DELIVERY_CHARGES = { standard: 0, express: 99 };

const generateOrderNumber = () => `FF-${Math.floor(100000 + Math.random() * 900000)}`;

const serializeOrder = (order) => ({
  id: order.orderNumber,
  _id: order._id.toString(),
  date: new Date(order.createdAt).toLocaleDateString(),
  customer: order.customer,
  address: order.address,
  items: order.items.map((item) => ({
    id: item.product?.toString(),
    name: item.name,
    scientificName: item.scientificName,
    image: item.image,
    price: item.price,
    quantity: item.quantity,
  })),
  deliveryMethod: order.deliveryMethod,
  paymentMethod: order.paymentMethod,
  totalItems: order.totalItems,
  subtotal: order.subtotal,
  deliveryCharge: order.deliveryCharge,
  total: order.total,
  status: order.status,
});

export const createOrder = async (req, res, next) => {
  try {
    const { customer, address, deliveryMethod = "standard", paymentMethod = "cod" } = req.body;

    if (!customer?.name || !customer?.phone || !customer?.email) {
      const err = new Error("Customer name, phone and email are required.");
      err.statusCode = 400;
      throw err;
    }
    if (!address?.house || !address?.street || !address?.city || !address?.state || !address?.pincode) {
      const err = new Error("A complete delivery address is required.");
      err.statusCode = 400;
      throw err;
    }
    if (!(deliveryMethod in DELIVERY_CHARGES)) {
      const err = new Error("Invalid delivery method.");
      err.statusCode = 400;
      throw err;
    }

    const cart = await Cart.findOne({ user: req.user.id }).populate("items.product");
    const items = (cart?.items || []).filter((item) => item.product);
    if (items.length === 0) {
      const err = new Error("Your cart is empty.");
      err.statusCode = 400;
      throw err;
    }
    const outOfStock = items.find((item) => !item.product.inStock);
    if (outOfStock) {
      const err = new Error(`"${outOfStock.product.name}" is currently out of stock.`);
      err.statusCode = 400;
      throw err;
    }

    // Prices/totals are always computed server-side from the current
    // product records - the client never gets to dictate what it pays.
    const orderItems = items.map((item) => ({
      product: item.product._id,
      name: item.product.name,
      scientificName: item.product.scientificName,
      image: item.product.image,
      price: item.product.price,
      quantity: item.quantity,
    }));
    const totalItems = orderItems.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const deliveryCharge = DELIVERY_CHARGES[deliveryMethod];
    const total = subtotal + deliveryCharge;

    const order = await Order.create({
      user: req.user.id,
      orderNumber: generateOrderNumber(),
      items: orderItems,
      customer,
      address,
      deliveryMethod,
      paymentMethod,
      totalItems,
      subtotal,
      deliveryCharge,
      total,
      status: "Confirmed",
    });

    cart.items = [];
    await cart.save();

    res.status(201).json({ success: true, order: serializeOrder(order) });
  } catch (err) {
    next(err);
  }
};

export const getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json({ success: true, orders: orders.map(serializeOrder) });
  } catch (err) {
    next(err);
  }
};

export const getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    // A wrong owner and a nonexistent order both look like "not found" -
    // never confirm to a caller that a given order id belongs to someone
    // else.
    if (!order || order.user.toString() !== req.user.id) {
      const err = new Error("Order not found.");
      err.statusCode = 404;
      throw err;
    }
    res.json({ success: true, order: serializeOrder(order) });
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(404).json({ success: false, message: "Order not found." });
    }
    next(err);
  }
};

export default { createOrder, getOrders, getOrder };
