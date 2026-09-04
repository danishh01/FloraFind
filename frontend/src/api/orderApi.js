import { apiRequest } from "./client";

// This is the Cash on Delivery path - POST /api/orders always creates a
// "cod" order. A Razorpay order is created differently, through
// paymentApi.js, after the payment has been verified.
export const createOrder = async (token, { customer, address, deliveryMethod }) => {
  const { order } = await apiRequest("/orders", {
    method: "POST",
    token,
    body: { customer, address, deliveryMethod },
  });
  return order;
};

export const getOrders = async (token) => {
  const { orders } = await apiRequest("/orders", { token });
  return orders;
};

export default { createOrder, getOrders };
