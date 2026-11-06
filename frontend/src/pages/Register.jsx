
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Register.css";

const API_URL = import.meta.env.VITE_API_URL;

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!name.trim() || !email.trim() || !password) {
      setError("Please fill all fields");
      return;
    }

    if (!API_URL) {
      setError("API URL is missing. Please check your .env file.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      setSuccess("Registration successful! Redirecting to login...");

      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 1000);
    } catch (err) {
      setError(
        err.message || "Unable to register. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="register-container" className="register-container">

      <div id="register-card" className="register-card">

        <h1 id="register-title" className="register-title">
          Register
        </h1>

        <p id="register-subtitle" className="register-subtitle">
          Create your account and get started today!
        </p>

        <form
          id="register-form"
          className="register-form"
          onSubmit={handleRegister}
        >

          {/* Name Input */}
          <div id="name-group" className="name-group">
            <label htmlFor="register-name">Name</label>

            <input
              id="register-name"
              className="register-name"
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* Email Input */}
          <div id="email-group" className="email-group">
            <label htmlFor="register-email">Email</label>

            <input
              id="register-email"
              className="register-email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password Input */}
          <div id="password-group" className="password-group">
            <label htmlFor="register-password">Password</label>

            <input
              id="register-password"
              className="register-password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Error Message */}
          {error && (
            <p id="register-error" className="register-error">
              {error}
            </p>
          )}

          {/* Success Message */}
          {success && (
            <p id="register-success" className="register-success">
              {success}
            </p>
          )}

          {/* Register Button */}
          <button
            id="register-button"
            className="register-button"
            type="submit"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>

        </form>

        {/* Login Link */}
        <p id="register-footer" className="register-footer">
          Already have an account?{" "}
          <Link
            id="login-link"
            className="login-link"
            to="/login"
          >
            Login
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Register;
