// Flattens a Product document to the shape the existing frontend already
// expects on cart/wishlist/product-list items (`id`, not `_id`).
export const serializeProduct = (product) => ({
  id: product._id.toString(),
  name: product.name,
  scientificName: product.scientificName,
  category: product.category,
  image: product.image,
  price: product.price,
  rating: product.rating,
  reviews: product.reviews,
  inStock: product.inStock,
  benefits: product.benefits,
});

export default serializeProduct;
