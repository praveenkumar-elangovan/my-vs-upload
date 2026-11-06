import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../redux/productSlice";
import "./products.css";
import ProductCard from "../components/ProductCard";

function Products() {
  const dispatch = useDispatch();

  const { products, loading, error } = useSelector(
    (state) => state.products
  );

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="products-page">
        <p className="products-state is-loading">Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="products-page">
        <p className="products-state is-error">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="products-page">
      <div className="products-inner">
        <header className="products-header">
          <h1 className="products-title">Products</h1>
          {products.length > 0 && (
            <span className="products-count">{products.length} items</span>
          )}
        </header>

        {products.length === 0 ? (
          <p className="products-state">No products available.</p>
        ) : (
          <div className="products-grid">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Products;