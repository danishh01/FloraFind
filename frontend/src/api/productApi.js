import { apiRequest } from "./client";

export const getProducts = async () => {
  const { products } = await apiRequest("/products");
  return products;
};

export const getProduct = async (id) => {
  const { product } = await apiRequest(`/products/${id}`);
  return product;
};
