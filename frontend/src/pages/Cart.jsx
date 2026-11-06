import { useDispatch, useSelector } from "react-redux";
import {
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  clearCart,
} from "../redux/cartSlice";
import { Link } from "react-router-dom";
import "./cart.css";

function Cart() {
  const dispatch = useDispatch();

  const cartItems = useSelector((state) => state.cart.items);

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="cart-page">
      <div className="cart-inner">
        <header className="cart-header">
          <h1 className="cart-title">Shopping Cart</h1>
          <span className="cart-count">
            {cartItems.length} {cartItems.length === 1 ? "item" : "items"}
          </span>
        </header>

        {cartItems.length === 0 ? (
          <div className="cart-state">
            <p>Your cart is empty.</p>
            <Link to="/products" className="cart-btn">
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="cart-layout">
            <div className="cart-list">
              {cartItems.map((item) => (
                <div className="cart-item" key={item._id}>
                  <div className="cart-item-info">
                    <h3>{item.name}</h3>
                    <p>₹{item.price} each</p>
                  </div>

                  <div className="cart-qty">
                    <button
                      aria-label={`Decrease quantity of ${item.name}`}
                      onClick={() => dispatch(decreaseQuantity(item._id))}
                    >
                      −
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      aria-label={`Increase quantity of ${item.name}`}
                      onClick={() => dispatch(increaseQuantity(item._id))}
                    >
                      +
                    </button>
                  </div>

                  <div className="cart-subtotal">
                    ₹{item.price * item.quantity}
                  </div>

                  <button
                    className="cart-remove"
                    onClick={() => dispatch(removeFromCart(item._id))}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <aside className="cart-summary">
              <h2>Bill</h2>

              <div className="cart-summary-row">
                <span>Items</span>
                <span>{cartItems.length}</span>
              </div>

              <div className="cart-summary-total">
                <span>Total</span>
                <strong>₹{total}</strong>
              </div>

              <Link to="/checkout" className="cart-btn">
                Proceed to Checkout
              </Link>

              <button
                className="cart-clear"
                onClick={() => dispatch(clearCart())}
              >
                Clear Cart
              </button>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;