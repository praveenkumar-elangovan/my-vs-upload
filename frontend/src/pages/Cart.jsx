
import { useDispatch, useSelector } from "react-redux";
import {
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  clearCart,
} from "../redux/cartSlice";
import { Link } from "react-router-dom";

function Cart() {
  const dispatch = useDispatch();

  const cartItems = useSelector(
    (state) => state.cart.items
  );

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div>
      <h1>Shopping Cart</h1>

      <p>Cart Items: {cartItems.length}</p>

      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          {cartItems.map((item) => (
            <div key={item._id}>
              <h3>{item.name}</h3>
              <p>Price: ₹{item.price}</p>

              <button
                onClick={() =>
                  dispatch(decreaseQuantity(item._id))
                }
              >
                -
              </button>

              <span> {item.quantity} </span>

              <button
                onClick={() =>
                  dispatch(increaseQuantity(item._id))
                }
              >
                +
              </button>

              <p>
                Subtotal: ₹{item.price * item.quantity}
              </p>

              <button
                onClick={() =>
                  dispatch(removeFromCart(item._id))
                }
              >
                Remove
              </button>

              <hr />
            </div>
          ))}

          <h2>Total: ₹{total}</h2>

          <button onClick={() => dispatch(clearCart())}>
            Clear Cart
          </button>

          <Link to="/checkout">Proceed to Checkout</Link>
        </>
      )}
    </div>
  );
}

export default Cart;