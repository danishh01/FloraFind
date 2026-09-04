import Cart from "../models/Cart.js";
import Order from "../models/Order.js";

const DELIVERY_CHARGES = { standard: 0, express: 99 };

const generateOrderNumber = () => `FF-${Math.floor(100000 + Math.random() * 900000)}`;

export const serializeOrder = (order) => ({
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
  paymentStatus: order.paymentStatus,
  totalItems: order.totalItems,
  subtotal: order.subtotal,
  deliveryCharge: order.deliveryCharge,
  total: order.total,
  status: order.status,
});

// Throws a 400 error if the customer/address details are incomplete. Used
// by both the normal (Cash on Delivery) checkout below and the Razorpay
// payment verification in paymentController.js, so both paths apply the
// exact same rule instead of two slightly different copies of it.
export const validateCustomerAndAddress = (customer, address) => {
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
};

// Loads the logged-in user's cart and works out what they'd actually pay -
// this is the ONE place order totals are calculated from the real product
// data in MongoDB, never from anything the client sends. Both the normal
// checkout and the Razorpay flow (once to know the amount to charge, and
// again after payment to create the real order) call this same function,
// so there is only one place that can get the math wrong.
export const calculateOrderFromCart = async (userId, deliveryMethod = "standard") => {
  if (!(deliveryMethod in DELIVERY_CHARGES)) {
    const err = new Error("Invalid delivery method.");
    err.statusCode = 400;
    throw err;
  }

  const cart = await Cart.findOne({ user: userId }).populate("items.product");
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

  return { cart, orderItems, totalItems, subtotal, deliveryCharge, total };
};

// Actually creates the Order document and empties the cart. Called once the
// order is fully decided - for Cash on Delivery that's right after
// validation, for Razorpay that's only after the payment signature has
// been verified (see paymentController.verifyPayment).
export const saveOrderAndClearCart = async ({
  userId,
  cart,
  orderItems,
  totalItems,
  subtotal,
  deliveryCharge,
  total,
  customer,
  address,
  deliveryMethod,
  paymentMethod,
  paymentStatus,
  razorpayOrderId,
  razorpayPaymentId,
}) => {
  const order = await Order.create({
    user: userId,
    orderNumber: generateOrderNumber(),
    items: orderItems,
    customer,
    address,
    deliveryMethod,
    paymentMethod,
    paymentStatus,
    razorpayOrderId,
    razorpayPaymentId,
    totalItems,
    subtotal,
    deliveryCharge,
    total,
    status: "Confirmed",
  });

  cart.items = [];
  await cart.save();

  return order;
};

export const createOrder = async (req, res, next) => {
  try {
    const { customer, address, deliveryMethod = "standard" } = req.body;

    validateCustomerAndAddress(customer, address);
    const { cart, orderItems, totalItems, subtotal, deliveryCharge, total } =
      await calculateOrderFromCart(req.user.id, deliveryMethod);

    const order = await saveOrderAndClearCart({
      userId: req.user.id,
      cart,
      orderItems,
      totalItems,
      subtotal,
      deliveryCharge,
      total,
      customer,
      address,
      deliveryMethod,
      paymentMethod: "cod",
      paymentStatus: "pending",
    });

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

export default {
  createOrder,
  getOrders,
  getOrder,
  serializeOrder,
  validateCustomerAndAddress,
  calculateOrderFromCart,
  saveOrderAndClearCart,
};
