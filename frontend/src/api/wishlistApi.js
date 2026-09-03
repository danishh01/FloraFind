import { apiRequest } from "./client";

export const getWishlist = async (token) => {
  const { wishlist } = await apiRequest("/wishlist", { token });
  return wishlist.products;
};

export const addProduct = async (token, productId) => {
  const { wishlist } = await apiRequest(`/wishlist/${productId}`, { method: "POST", token });
  return wishlist.products;
};

export const removeProduct = async (token, productId) => {
  const { wishlist } = await apiRequest(`/wishlist/${productId}`, { method: "DELETE", token });
  return wishlist.products;
};

export default { getWishlist, addProduct, removeProduct };
