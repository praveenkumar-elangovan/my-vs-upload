import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Heart, Star, ShoppingCart, Package } from "lucide-react";
import { addToCart } from "../redux/cartSlice";
import { toggleFavorite } from "../redux/favoritesSlice";

const API_URL = import.meta.env.VITE_API_URL;
const SERVER_URL = API_URL.replace(/\/api\/?$/, "");

const formatPrice = (n) => "₹" + Number(n || 0).toLocaleString("en-IN");

function Stars({ rating }) {
  return (
    <div className="stars" aria-label={`${rating} out of 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          size={15}
          className={n <= Math.round(rating) ? "star filled" : "star"}
        />
      ))}
    </div>
  );
}

function ProductCard({ product }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Intha product favorites la irukka nu check pannum
  const liked = useSelector((state) =>
    state.favorites.items.some((i) => i._id === product._id)
  );

  const handleAddToCart = () => {
    dispatch(addToCart(product));
    navigate("/cart");
  };

  const imagePath = product.image
    ? product.image.startsWith("http")
      ? product.image
      : `${SERVER_URL}${product.image.startsWith("/") ? "" : "/"}${product.image}`
    : "";

  const discount = product.oldPrice
    ? Math.round(
        ((product.oldPrice - product.price) / product.oldPrice) * 100
      )
    : 0;

  const outOfStock = product.stock <= 0;

  return (
    <article className="product-card">
      <div className="product-visual">
        {discount > 0 && (
          <span className="discount-tag">{discount}% OFF</span>
        )}

        <button
          type="button"
          className={`wish-btn ${liked ? "liked" : ""}`}
          onClick={() => dispatch(toggleFavorite(product))}
          aria-label={liked ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart size={18} />
        </button>

        <Link to={`/products/${product._id}`}>
          {imagePath ? (
            <img
              src={imagePath}
              alt={product.name}
              className="product-img"
            />
          ) : (
            <Package size={64} strokeWidth={1.4} />
          )}
        </Link>
      </div>

      <div className="product-info">
        <span className="product-category">{product.category}</span>

        <h3>
          <Link to={`/products/${product._id}`}>{product.name}</Link>
        </h3>

        <div className="product-rating">
          <Stars rating={product.rating || 0} />
          <span>{product.rating || 0}</span>
        </div>

        <div className="product-bottom">
          <div className="price">
            <strong>{formatPrice(product.price)}</strong>
            {product.oldPrice > 0 && (
              <del>{formatPrice(product.oldPrice)}</del>
            )}
          </div>
        </div>

        <div className="card-actions">
          <Link
            to={`/products/${product._id}`}
            className="view-details-btn"
          >
            View Details
          </Link>

          <button
            type="button"
            className="add-cart-btn"
            onClick={handleAddToCart}
            disabled={outOfStock}
          >
            <ShoppingCart size={16} />
            {outOfStock ? "Out of stock" : "Add to Cart"}
          </button>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;