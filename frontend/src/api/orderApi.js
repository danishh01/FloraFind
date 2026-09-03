import { apiRequest } from "./client";

export const createOrder = async (token, { customer, address, deliveryMethod, paymentMethod }) => {
  const { order } = await apiRequest("/orders", {
    method: "POST",
    token,
    body: { customer, address, deliveryMethod, paymentMethod },
  });
  return order;
};

export const getOrders = async (token) => {
  const { orders } = await apiRequest("/orders", { token });
  return orders;
};

export default { createOrder, getOrders };
