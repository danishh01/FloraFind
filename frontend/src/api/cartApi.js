import { apiRequest } from "./client";

export const getCart = async (token) => {
  const { cart } = await apiRequest("/cart", { token });
  return cart.items;
};

export const addItem = async (token, productId, quantity = 1) => {
  const { cart } = await apiRequest("/cart/items", {
    method: "POST",
    token,
    body: { productId, quantity },
  });
  return cart.items;
};

export const updateItem = async (token, productId, quantity) => {
  const { cart } = await apiRequest(`/cart/items/${productId}`, {
    method: "PATCH",
    token,
    body: { quantity },
  });
  return cart.items;
};

export const removeItem = async (token, productId) => {
  const { cart } = await apiRequest(`/cart/items/${productId}`, {
    method: "DELETE",
    token,
  });
  return cart.items;
};

export const clearCart = async (token) => {
  const { cart } = await apiRequest("/cart", { method: "DELETE", token });
  return cart.items;
};

export default { getCart, addItem, updateItem, removeItem, clearCart };
