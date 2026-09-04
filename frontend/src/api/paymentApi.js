import { apiRequest } from "./client";

// Step 1 of the Razorpay flow - ask the backend to open a Razorpay order
// for the current cart. The backend works out the amount itself; we only
// tell it which delivery option was picked (that's the only thing that
// changes the total).
export const createPaymentOrder = async (token, { deliveryMethod }) => {
  const { razorpayOrderId, amount, currency, keyId } = await apiRequest("/payment/create-order", {
    method: "POST",
    token,
    body: { deliveryMethod },
  });
  return { razorpayOrderId, amount, currency, keyId };
};

// Step 2 - after Razorpay Checkout closes with a successful payment, send
// what it returned to the backend so it can verify the signature and (only
// if that passes) create the real FloraFind order.
export const verifyPayment = async (token, paymentData) => {
  const { order } = await apiRequest("/payment/verify", {
    method: "POST",
    token,
    body: paymentData,
  });
  return order;
};

export default { createPaymentOrder, verifyPayment };
