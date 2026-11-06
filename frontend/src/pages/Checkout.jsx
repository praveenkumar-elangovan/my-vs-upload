import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";

import {
  createOrder,
  verifyPayment,
} from "../redux/orderSlice";

import { clearCart } from "../redux/cartSlice";
import "./checkout.css";

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

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement("script");
      script.src =
        "https://checkout.razorpay.com/v1/checkout.js";

      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);

      document.body.appendChild(script);
    });
  };

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0 || loading) return;

    try {
      // 1. Load Razorpay checkout
      const scriptLoaded = await loadRazorpayScript();

      if (!scriptLoaded) {
        throw new Error("Razorpay SDK failed to load");
      }

      // 2. Create order on backend
      const orderData = {
        products: cartItems.map((item) => ({
          productId: item._id,
          quantity: item.quantity,
        })),
      };

      const result = await dispatch(
        createOrder(orderData)
      ).unwrap();

      // Backend response contains order and Razorpay details
      const { razorpay, order } = result;

      if (!razorpay?.orderId || !razorpay?.key) {
        throw new Error(
          "Razorpay details missing. Check backend response."
        );
      }

      // 3. Open Razorpay payment popup
      const options = {
        key: razorpay.key,
        amount: razorpay.amount,
        currency: razorpay.currency,
        name: "My E-Commerce Store",
        description: "Purchase Payment",
        order_id: razorpay.orderId,

        handler: async function (response) {
          try {
            // 4. Verify payment on backend
            await dispatch(
              verifyPayment({
                razorpay_order_id:
                  response.razorpay_order_id,
                razorpay_payment_id:
                  response.razorpay_payment_id,
                razorpay_signature:
                  response.razorpay_signature,
              })
            ).unwrap();

            // 5. Clear cart only after verification succeeds
            dispatch(clearCart());
            navigate("/orders");
          } catch (err) {
            console.error("Payment verification failed:", err);
            window.alert(
              typeof err === "string"
                ? err
                : "Payment verification failed. Please check your orders before trying again."
            );
          }
        },

        modal: {
          ondismiss: function () {
            console.log("Razorpay checkout closed");
          },
        },

        theme: {
          color: "#2338E0",
        },
      };

      const paymentObject = new window.Razorpay(options);

      paymentObject.on("payment.failed", function (response) {
        console.error(
          "Payment failed:",
          response.error?.description
        );

        window.alert(
          response.error?.description || "Payment failed"
        );
      });

      paymentObject.open();
    } catch (err) {
      console.error("Order/payment error:", err);

      window.alert(
        typeof err === "string"
          ? err
          : err.message || "Unable to start payment"
      );
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="co-page">
        <div className="co-inner">
          <h1 className="co-title">Checkout</h1>
          <div className="co-state">
            <p>Your cart is empty.</p>
            <Link to="/products" className="co-btn">
              Shop Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="co-page">
      <div className="co-inner">
        <Link to="/cart" className="co-back">
          Back to Cart
        </Link>

        <h1 className="co-title">Checkout</h1>

        <div className="co-ticket">
          <ul className="co-items">
            {cartItems.map((item) => (
              <li className="co-item" key={item._id}>
                <span className="co-item-name">{item.name}</span>
                <span className="co-item-qty">× {item.quantity}</span>
                <span className="co-item-price">
                  ₹{item.price * item.quantity}
                </span>
              </li>
            ))}
          </ul>

          <div className="co-stub">
            <div className="co-total">
              <span>Estimated Total</span>
              <strong>₹{totalAmount.toFixed(2)}</strong>
            </div>

            {error && <p className="co-error">{error}</p>}

            <button
              className="co-btn"
              onClick={handlePlaceOrder}
              disabled={loading}
            >
              {loading ? "Processing..." : "Pay Now"}
            </button>

            <p className="co-note">Payments are processed securely by Razorpay.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;