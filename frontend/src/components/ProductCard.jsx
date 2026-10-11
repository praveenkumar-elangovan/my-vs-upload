
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { addToCart } from "../redux/cartSlice";

const API_URL = import.meta.env.VITE_API_URL;
const SERVER_URL = API_URL.replace(/\/api\/?$/, "");

function ProductCard({ product }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleAddToCart = () => {
    dispatch(addToCart(product));
    navigate("/cart");
  };

  const imagePath = product.image
    ? product.image.startsWith("http")
      ? product.image
      : `${SERVER_URL}${product.image.startsWith("/") ? "" : "/"}${product.image}`
    : "";

  return (
    <div className="product-card">
      {imagePath && (
        <img
          src={imagePath}
          alt={product.name}
          width="200"
        />
      )}

      <h3>{product.name}</h3>
      <p>{product.description}</p>
      <p>Price: ₹{product.price}</p>

      <Link to={`/products/${product._id}`}>
        View Details
      </Link>

      <button onClick={handleAddToCart}>
        Add to Cart
      </button>
    </div>
  );
}

export default ProductCard;
