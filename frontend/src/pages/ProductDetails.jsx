
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { fetchProductById } from "../redux/productSlice";

const API_URL = import.meta.env.VITE_API_URL;
const SERVER_URL = API_URL.replace(/\/api\/?$/, "");

function ProductDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { selectedProduct, loading, error } = useSelector(
    (state) => state.products
  );

  useEffect(() => {
    dispatch(fetchProductById(id));
  }, [dispatch, id]);

  if (loading) {
    return <p>Loading product details...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!selectedProduct) {
    return <p>Product not found.</p>;
  }

  const product = selectedProduct;

  const imagePath = product.image
    ? product.image.startsWith("http")
      ? product.image
      : `${SERVER_URL}${product.image.startsWith("/") ? "" : "/"}${product.image}`
    : "";

  return (
    <div className="product-details">
      <h1>Product Details</h1>

      {imagePath && (
        <img
          src={imagePath}
          alt={product.name}
          width="300"
        />
      )}

      <h2>{product.name}</h2>

      <p>Description: {product.description}</p>

      <h3>Price: ₹{product.price}</h3>

      <p>Category: {product.category}</p>

      <p>Stock: {product.stock}</p>

      <Link to="/products">
        Back to Products
      </Link>
    </div>
  );
}

export default ProductDetails;
