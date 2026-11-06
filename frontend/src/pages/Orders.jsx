import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyOrders } from "../redux/orderSlice";
import "./orders.css";

function Orders() {
  const dispatch = useDispatch();

  const { orders, loading, error } = useSelector(
    (state) => state.orders
  );

  useEffect(() => {
    dispatch(fetchMyOrders());
  }, [dispatch]);

  const safeOrders = Array.isArray(orders) ? orders : [];

  // Order date and time format
  const formatDateTime = (date) => {
    if (!date) return "Date unavailable";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Date unavailable";
    }

    return parsedDate.toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="orders-page">
      <div className="orders-inner">
        <header className="orders-header">
          <h1 className="orders-title">My Orders</h1>

          {!loading && !error && safeOrders.length > 0 && (
            <span className="orders-count">
              {safeOrders.length}{" "}
              {safeOrders.length === 1 ? "order" : "orders"}
            </span>
          )}
        </header>

        {loading && (
          <p className="orders-state">Loading orders...</p>
        )}

        {error && (
          <p className="orders-state orders-error">
            Error: {error}
          </p>
        )}

        {!loading && !error && safeOrders.length === 0 && (
          <p className="orders-state">No orders found.</p>
        )}

        {!loading && !error && (
          <div className="orders-list">
            {safeOrders.map((order) => (
              <article className="orders-receipt" key={order._id}>
                <div className="orders-receipt-head">
                  <div>
                    <span className="orders-label">Order ID</span>
                    <span className="orders-id">{order._id}</span>
                  </div>

                  <div className="orders-date">
                    {formatDateTime(order.createdAt)}
                  </div>
                </div>

                <div className="orders-items">
                  {order.products?.map((item, index) => {
                    // First check saved order price, then product price
                    const priceValue =
                      item.price ?? item.productId?.price;

                    const unitPrice = Number(priceValue);
                    const hasPrice =
                      priceValue !== undefined &&
                      priceValue !== null &&
                      Number.isFinite(unitPrice);

                    const subtotal = hasPrice
                      ? unitPrice * Number(item.quantity)
                      : null;

                    return (
                      <div
                        className="orders-item"
                        key={item._id || index}
                      >
                        <div className="orders-item-name">
                          {item.productId?.name || "Product unavailable"}
                        </div>

                        <div className="orders-item-qty">
                          {item.quantity} ×{" "}
                          {hasPrice ? `₹${unitPrice}` : "Price unavailable"}
                        </div>

                        <div className="orders-item-sub">
                          {subtotal !== null
                            ? `₹${subtotal}`
                            : "Price unavailable"}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="orders-total">
                  <span>Total Amount</span>
                  <strong>
                    {Number.isFinite(Number(order.totalAmount))
                      ? `₹${Number(order.totalAmount)}`
                      : "Amount unavailable"}
                  </strong>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Orders;