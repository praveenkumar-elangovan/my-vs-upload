
import { useState } from "react";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../redux/authSlice";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";

const API_URL = import.meta.env.VITE_API_URL;

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      if (!data.token || !data.user) {
        throw new Error("Invalid login response from server");
      }

      dispatch(loginSuccess({
        user: data.user,
        token: data.token,
      }));

      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="login-container" className="login-container">

      <div id="login-card" className="login-card">

        <h1 id="login-title" className="login-title">
          Login
        </h1>

        <p id="login-subtitle" className="login-subtitle">
          Welcome back! Please login to your account.
        </p>

        <form id="login-form" className="login-form" onSubmit={handleLogin}>

          <input
            id="login-email"
            className="login-email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            id="login-password"
            className="login-password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            id="login-button"
            className="login-button"
            type="submit"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        {error && (
          <p id="login-error" className="login-error">
            {error}
          </p>
        )}

        <p id="login-footer" className="login-footer">
          Don't have an account?{" "}
          <Link id="register-link" className="register-link" to="/register">
            Register
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Login;
