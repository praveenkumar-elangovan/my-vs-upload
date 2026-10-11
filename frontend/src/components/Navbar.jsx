
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { ShoppingCart } from "lucide-react";
import { logout } from "../redux/authSlice";
import "./Navbar.css";

function Navbar() {
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
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
        <Link to="/cart">Cart</Link>

        {token ? (
          <>
            <Link to="/orders">My Orders</Link>

            <button
              className="logout-btn"
              onClick={handleLogout}
            >
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
