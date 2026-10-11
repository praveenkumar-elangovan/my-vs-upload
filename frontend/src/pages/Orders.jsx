
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyOrders } from "../redux/orderSlice";

function Orders() {
  const dispatch = useDispatch();

  const { orders, loading, error } = useSelector(
    (state) => state.orders
  );

  useEffect(() => {
    dispatch(fetchMyOrders());
  }, [dispatch]);

  return (
    <div>
      <h1>My Orders</h1>

      {loading && <p>Loading orders...</p>}

      {error && <p>Error: {error}</p>}

      {!loading && !error && orders.length === 0 && (
        <p>No orders found.</p>
      )}

      {orders.map((order) => (
        <div key={order._id}>
          <h3>Order ID: {order._id}</h3>

          <p>Total Amount: ₹{order.totalAmount}</p>

          <h4>Products</h4>

          {order.products?.map((item, index) => (
            <div key={item._id || index}>
              <p>
                Product: {item.productId?.name || "Product unavailable"}
              </p>

              <p>Quantity: {item.quantity}</p>

              <p>Price: ₹{item.price}</p>
            </div>
          ))}

          <hr />
        </div>
      ))}
    </div>
  );
}

export default Orders;