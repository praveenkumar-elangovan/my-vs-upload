import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link, useNavigate } from "react-router-dom";
import { fetchProductById } from "../redux/productSlice";
import { setCartQuantity } from "../redux/cartSlice";
import Review from "../components/Review";
import "./productDetails.css";

const API_URL = import.meta.env.VITE_API_URL;
const SERVER_URL = API_URL.replace(/\/api\/?$/, "");

function ProductDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { selectedProduct, loading, error } = useSelector(
    (state) => state.products
  );
  const cartItems = useSelector((state) => state.cart.items);

  const [qty, setQty] = useState(1);

  useEffect(() => {
    dispatch(fetchProductById(id));
  }, [dispatch, id]);

  // Already cart-la irundha, andha quantity-la start aagum
  useEffect(() => {
    const inCartItem = cartItems.find((item) => item._id === id);
    setQty(inCartItem ? inCartItem.quantity : 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading) {
    return (
      <div className="pd-page">
        <p className="pd-state is-loading">Loading product details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pd-page">
        <p className="pd-state is-error">Error: {error}</p>
      </div>
    );
  }

  if (!selectedProduct) {
    return (
      <div className="pd-page">
        <p className="pd-state">Product not found.</p>
      </div>
    );
  }

  const product = selectedProduct;
  const stock = Number(product.stock);
  const inStock = stock > 0;
  const inCart = cartItems.some((item) => item._id === product._id);

  const discount =
    product.oldPrice > 0
      ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
      : 0;

  const imagePath = product.image
    ? product.image.startsWith("http")
      ? product.image
      : `${SERVER_URL}${product.image.startsWith("/") ? "" : "/"}${product.image}`
    : "";

  const total = Number(product.price) * qty;

  const decrease = () => setQty((q) => Math.max(1, q - 1));
  const increase = () => setQty((q) => Math.min(stock, q + 1));

  const handleAddToCart = () => {
    dispatch(setCartQuantity({ product, quantity: qty }));
    navigate("/cart");
  };

  const handleBuyNow = () => {
    dispatch(setCartQuantity({ product, quantity: qty }));
    navigate("/checkout");
  };

  return (
    <div className="pd-page">
      <div className="pd-inner">
        <Link to="/products" className="pd-back">
          Back to Products
        </Link>

        <div className="pd-layout">
          <div className="pd-media">
            {imagePath ? (
              <img src={imagePath} alt={product.name} />
            ) : (
              <div className="pd-noimage">No image</div>
            )}
          </div>

          <div className="pd-info">
            {product.category && (
              <span className="pd-category">{product.category}</span>
            )}

            <h1 className="pd-name">{product.name}</h1>

            <p className="pd-rating">
              ⭐ {product.rating || 0} / 5
              {product.numReviews > 0 && ` (${product.numReviews} reviews)`}
            </p>

            <p className="pd-description">{product.description}</p>

            <div className="pd-price">
              ₹{Number(product.price).toLocaleString("en-IN")}
              {product.oldPrice > 0 && (
                <>
                  <del className="pd-oldprice">
                    ₹{Number(product.oldPrice).toLocaleString("en-IN")}
                  </del>
                  <span className="pd-off">{discount}% OFF</span>
                </>
              )}
            </div>

            <p className={`pd-stock ${inStock ? "is-in" : "is-out"}`}>
              {inStock ? `${product.stock} in stock` : "Out of stock"}
            </p>

            {inStock && (
              <>
                {/* Quantity selector */}
                <div className="pd-qty-row">
                  <span className="pd-qty-label">Quantity</span>

                  <div className="pd-qty">
                    <button
                      type="button"
                      onClick={decrease}
                      disabled={qty <= 1}
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <span>{qty}</span>
                    <button
                      type="button"
                      onClick={increase}
                      disabled={qty >= stock}
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Total */}
                <div className="pd-total">
                  <span>Total</span>
                  <strong>₹{total.toLocaleString("en-IN")}</strong>
                </div>
              </>
            )}

            <div className="pd-actions">
              <button
                type="button"
                className="pd-btn pd-btn-cart"
                onClick={handleAddToCart}
                disabled={!inStock}
              >
                {inCart ? "Update Cart" : "Add to Cart"}
              </button>

              <button
                type="button"
                className="pd-btn pd-btn-buy"
                onClick={handleBuyNow}
                disabled={!inStock}
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>

        {/* Reviews section */}
        <Review
          productId={id}
          onChange={() => dispatch(fetchProductById(id))}
        />
      </div>
    </div>
  );
}

export default ProductDetails;