import Razorpay from "razorpay";
import crypto from "node:crypto";

// Razorpay TEST MODE only. Keys come from backend/.env (RAZORPAY_KEY_ID /
// RAZORPAY_KEY_SECRET) - the secret key never leaves the backend and is
// never sent to the frontend.
//
// The Razorpay client is built lazily (only inside createRazorpayOrder,
// only after confirming both keys exist) rather than at the top of this
// file. The Razorpay SDK itself throws immediately if key_id is missing -
// building it as soon as this file is imported would crash the ENTIRE
// backend on startup whenever Razorpay isn't configured yet, not just the
// payment feature.
const getRazorpayClient = () =>
  new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

/**
 * Creates a Razorpay order for the given amount (in rupees). This is the
 * step that happens BEFORE the user pays - Razorpay's Checkout widget needs
 * a valid order id to open. Razorpay itself works in the smallest currency
 * unit (paise for INR), so the amount is multiplied by 100 here.
 */
export const createRazorpayOrder = async (amountInRupees) => {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    const err = new Error("Online payment is not configured on the server.");
    err.statusCode = 503;
    throw err;
  }

  try {
    const razorpay = getRazorpayClient();
    return await razorpay.orders.create({
      amount: Math.round(amountInRupees * 100),
      currency: "INR",
      receipt: `ff_${Date.now()}`,
    });
  } catch {
    const err = new Error("Could not start the payment. Please try again.");
    err.statusCode = 502;
    throw err;
  }
};

/**
 * Confirms a Razorpay payment actually came from Razorpay and was not
 * tampered with. Razorpay signs "<order_id>|<payment_id>" with our secret
 * key (HMAC-SHA256) and sends that signature back after a successful
 * payment - this recreates the same signature on the server and compares
 * it. Only a match proves the payment is genuine; the frontend saying
 * "payment succeeded" is never trusted on its own.
 */
export const verifyPaymentSignature = ({ razorpay_order_id, razorpay_payment_id, razorpay_signature }) => {
  if (!process.env.RAZORPAY_KEY_SECRET) {
    const err = new Error("Online payment is not configured on the server.");
    err.statusCode = 503;
    throw err;
  }

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  return expectedSignature === razorpay_signature;
};

export default { createRazorpayOrder, verifyPaymentSignature };
