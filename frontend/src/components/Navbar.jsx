import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { ShoppingCart, Crown, Heart } from "lucide-react";
import { logout } from "../redux/authSlice";
import {
  fetchSubscriptionStatus,
  clearSubscription,
} from "../redux/subscriptionSlice";
import "./Navbar.css";

function Navbar() {
  const token = useSelector((state) => state.auth.token);
  const isPremium = useSelector((state) => state.subscription.isPremium);
  const favCount = useSelector((state) => state.favorites.items.length);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Login aana apram (or page refresh la) premium status load pannum
  useEffect(() => {
    if (token) {
      dispatch(fetchSubscriptionStatus());
    }
  }, [token, dispatch]);

  const handleLogout = () => {
    dispatch(clearSubscription());
    dispatch(logout());
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <Link to="/" className="brand-logo">
        <ShoppingCart size={32} strokeWidth={2.5} />

        <span>
          Shop<span className="brand-highlight">Ease</span>
        </span>
      </Link>

      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/products">Products</Link>

        <Link to="/favorites" className="nav-fav">
          <Heart size={16} />
          Favorites{favCount > 0 && ` (${favCount})`}
        </Link>

        <Link to="/cart">Cart</Link>

        <Link to="/subscription" className="nav-premium">
          <Crown size={16} />
          {isPremium ? "Premium Member" : "Go Premium"}
        </Link>

        {token ? (
          <>
            <Link to="/orders">My Orders</Link>

            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;