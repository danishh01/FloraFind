import Order from "../models/Order.js";
import razorpayService from "../services/razorpayService.js";
import {
  serializeOrder,
  validateCustomerAndAddress,
  calculateOrderFromCart,
  saveOrderAndClearCart,
} from "./orderController.js";

// STEP 1 of the Razorpay flow: work out how much the user's cart actually
// costs (server-side, from the real cart/product data) and ask Razorpay to
// open a "payment order" for that amount. Nothing is saved to FloraFind's
// own orders yet - that only happens after the payment is verified below.
export const createPaymentOrder = async (req, res, next) => {
  try {
    const { deliveryMethod = "standard" } = req.body;

    const { total } = await calculateOrderFromCart(req.user.id, deliveryMethod);
    const razorpayOrder = await razorpayService.createRazorpayOrder(total);

    res.json({
      success: true,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      // The Key ID is safe to send to the frontend - Razorpay's Checkout
      // widget needs it to know which merchant account to pay into. It is
      // NOT the secret key, which never leaves the backend.
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    next(err);
  }
};

// STEP 2: after the user pays inside the Razorpay popup, the frontend sends
// us what Razorpay returned. We do NOT trust that on its own - we recompute
// the signature ourselves and only treat the payment as real if it matches.
// Only then do we create the actual FloraFind order and clear the cart.
export const verifyPayment = async (req, res, next) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      customer,
      address,
      deliveryMethod = "standard",
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      const err = new Error("Missing payment details.");
      err.statusCode = 400;
      throw err;
    }

    const isPaymentGenuine = razorpayService.verifyPaymentSignature({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    });
    if (!isPaymentGenuine) {
      const err = new Error("Payment verification failed. Please try again.");
      err.statusCode = 400;
      throw err;
    }

    // A genuine signature only proves the payment is real - it doesn't
    // prove this is the FIRST time we've seen it. If this exact payment was
    // already turned into an order (e.g. the frontend retried the request,
    // or the user double-clicked before the button disabled), return that
    // same order instead of creating a second one for a single payment.
    const existingOrder = await Order.findOne({ razorpayPaymentId: razorpay_payment_id });
    if (existingOrder) {
      return res.status(200).json({ success: true, order: serializeOrder(existingOrder) });
    }

    validateCustomerAndAddress(customer, address);
    // Recalculated fresh here rather than reusing the amount from step 1 -
    // the cart could in theory have changed between the two requests, and
    // the order we save must always match what's really in the cart now.
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
      paymentMethod: "razorpay",
      paymentStatus: "paid",
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
    });

    res.status(201).json({ success: true, order: serializeOrder(order) });
  } catch (err) {
    next(err);
  }
};

export default { createPaymentOrder, verifyPayment };
