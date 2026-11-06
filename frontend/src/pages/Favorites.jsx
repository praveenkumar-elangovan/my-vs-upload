import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Heart, ShoppingCart, Trash2, Package, Star } from "lucide-react";
import { addToCart } from "../redux/cartSlice";
import { removeFavorite } from "../redux/favoritesSlice";
import "./Favorites.css";

const API = "http://localhost:9000";

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

export default function Favorites() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const items = useSelector((state) => state.favorites.items);

  const handleAdd = (product) => {
    dispatch(addToCart(product));
    navigate("/cart");
  };

  return (
    <div className="fav-page">
      <div className="fav-box">
        <h1 className="fav-title">
          <Heart size={26} /> My Favorites
          <span>({items.length})</span>
        </h1>

        {items.length === 0 ? (
          <div className="fav-empty">
            <Heart size={60} strokeWidth={1.3} />
            <h2>No favorites yet</h2>
            <p>Tap the heart on any product to save it here.</p>
            <Link to="/products" className="fav-shop-btn">
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="product-grid">
            {items.map((p) => {
              const discount = p.oldPrice
                ? Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100)
                : 0;

              return (
                <article className="product-card" key={p._id}>
                  <div className="product-visual">
                    {discount > 0 && (
                      <span className="discount-tag">{discount}% OFF</span>
                    )}

                    <button
                      type="button"
                      className="wish-btn liked"
                      onClick={() => dispatch(removeFavorite(p._id))}
                      aria-label="Remove from favorites"
                    >
                      <Heart size={18} />
                    </button>

                    <Link to={`/products/${p._id}`}>
                      {p.image ? (
                        <img
                          src={`${API}${p.image}`}
                          alt={p.name}
                          className="product-img"
                        />
                      ) : (
                        <Package size={64} strokeWidth={1.4} />
                      )}
                    </Link>
                  </div>

                  <div className="product-info">
                    <span className="product-category">{p.category}</span>

                    <h3>
                      <Link to={`/products/${p._id}`}>{p.name}</Link>
                    </h3>

                    <div className="product-rating">
                      <Stars rating={p.rating || 0} />
                      <span>{p.rating || 0}</span>
                    </div>

                    <div className="product-bottom">
                      <div className="price">
                        <strong>{formatPrice(p.price)}</strong>
                        {p.oldPrice > 0 && <del>{formatPrice(p.oldPrice)}</del>}
                      </div>
                    </div>

                    <div className="card-actions">
                      <button
                        type="button"
                        className="view-details-btn fav-remove"
                        onClick={() => dispatch(removeFavorite(p._id))}
                      >
                        <Trash2 size={15} /> Remove
                      </button>

                      <button
                        type="button"
                        className="add-cart-btn"
                        onClick={() => handleAdd(p)}
                        disabled={p.stock <= 0}
                      >
                        <ShoppingCart size={16} />
                        {p.stock <= 0 ? "Out of stock" : "Add to Cart"}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}