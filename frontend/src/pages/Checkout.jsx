
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { createOrder } from "../redux/orderSlice";
import { clearCart } from "../redux/cartSlice";

function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cartItems = useSelector(
    (state) => state.cart.items
  );

  const { loading, error } = useSelector(
    (state) => state.orders
  );

  const totalAmount = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0 || loading) return;

    const orderData = {
      products: cartItems.map((item) => ({
        productId: item._id,
        quantity: item.quantity,
      })),
    };

    try {
      await dispatch(createOrder(orderData)).unwrap();

      dispatch(clearCart());
      navigate("/orders");
    } catch (err) {
      console.error("Order failed:", err);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div>
        <h1>Checkout</h1>
        <p>Your cart is empty.</p>
        <Link to="/products">Shop Products</Link>
      </div>
    );
  }

  return (
    <div>
      <h1>Checkout</h1>

      {cartItems.map((item) => (
        <div key={item._id}>
          <h3>{item.name}</h3>
          <p>Quantity: {item.quantity}</p>
          <p>Price: ₹{item.price * item.quantity}</p>
        </div>
      ))}

      <h2>Estimated Total: ₹{totalAmount}</h2>

      {error && <p>{error}</p>}

      <button
        onClick={handlePlaceOrder}
        disabled={loading}
      >
        {loading ? "Placing Order..." : "Place Order"}
      </button>
    </div>
  );
}

export default Checkout;