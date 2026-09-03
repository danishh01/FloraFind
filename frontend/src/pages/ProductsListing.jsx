import { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import ProductCard from "../components/ProductCard";
import StoreBackground from '../components/StoreBackground.jsx';
import StoreNavbar from '../components/StoreNavbar.jsx';
import SectionLoader from '../components/SectionLoader.jsx';
import { getProducts } from '../api/productApi';
import { ApiError } from '../api/client';

const ProductsListing = () => {
  const { Category } = useParams()
  const [searchParams] = useSearchParams();
  const search = searchParams.get("search") || "";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    getProducts()
      .then((data) => {
        if (!cancelled) setProducts(data);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof ApiError ? err.message : "Unable to load products.");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  let filteredProducts = Category
    ? products.filter((product) => product.category === Category)
    : products;

  if (search) {
    filteredProducts = filteredProducts.filter((product) =>
      product.name.toLowerCase().includes(search.toLowerCase())
    );
  }

  return (
    <StoreBackground className='min-h-screen '>

      <StoreNavbar />
      <div className='flex items-center justify-center gap-10 pt-40 pb-10'>
        {loading ? (
          <SectionLoader message="Loading products..." />
        ) : error ? (
          <p className="text-white text-lg hero-heading">{error}</p>
        ) : filteredProducts.length === 0 ? (
          <p className="text-white text-lg hero-heading">No products found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </StoreBackground>
  )
}

export default ProductsListing
