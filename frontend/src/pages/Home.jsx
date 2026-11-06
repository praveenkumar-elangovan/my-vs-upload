import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  ShoppingCart,
  Truck,
  ShieldCheck,
  Headphones,
  Tag,
  Smartphone,
  Shirt,
  Home as HomeIcon,
  Apple,
  Laptop,
  Watch,
  Star,
  Heart,
  Clock,
  Mail,
  Users,
  Package,
  Smile,
  MapPin,
} from "lucide-react";

import { addToCart } from "../redux/cartSlice";
import { toggleFavorite } from "../redux/favoritesSlice";
import Testimonials from "../components/Testimonials";

import "./Home.css";
import "./HomeSections.css";

/* ---------- Config ---------- */

const API = "http://localhost:9000";

/* ---------- Static data ---------- */

const categories = [
  { name: "Electronics", slug: "electronics", icon: Smartphone, count: "120+ items" },
  { name: "Fashion", slug: "fashion", icon: Shirt, count: "200+ items" },
  { name: "Home & Kitchen", slug: "home", icon: HomeIcon, count: "90+ items" },
  { name: "Grocery", slug: "grocery", icon: Apple, count: "150+ items" },
  { name: "Computers", slug: "computers", icon: Laptop, count: "60+ items" },
  { name: "Accessories", slug: "accessories", icon: Watch, count: "80+ items" },
];

const stats = [
  { icon: Users, value: "10,000+", label: "Happy Customers" },
  { icon: Package, value: "500+", label: "Products" },
  { icon: MapPin, value: "50+", label: "Cities Delivered" },
  { icon: Smile, value: "4.8/5", label: "Average Rating" },
];

/* ---------- Small helpers ---------- */

const formatPrice = (n) =>
  "₹" + Number(n || 0).toLocaleString("en-IN");

const pad = (n) => String(n).padStart(2, "0");

// Counts down to the end of today
function useCountdown() {
  const getLeft = () => {
    const end = new Date();
    end.setHours(23, 59, 59, 999);
    return Math.max(0, end - new Date());
  };

  const [left, setLeft] = useState(getLeft);

  useEffect(() => {
    const timer = setInterval(() => setLeft(getLeft()), 1000);
    return () => clearInterval(timer);
  }, []);

  return {
    hours: Math.floor(left / 3600000),
    minutes: Math.floor((left % 3600000) / 60000),
    seconds: Math.floor((left % 60000) / 1000),
  };
}

function Stars({ rating }) {
  return (
    <div className="stars" aria-label={`${rating} out of 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          size={15}
          className={n <= Math.round(rating) ? "star filled" : "star"}
        />
      ))}
    </div>
  );
}

function ProductCard({ product, index = 0, onAdd }) {
  const dispatch = useDispatch();

  // Redux favorites la intha product irukka nu check pannum
  const liked = useSelector((state) =>
    state.favorites.items.some((i) => i._id === product._id)
  );

  const discount = product.oldPrice
    ? Math.round(
        ((product.oldPrice - product.price) / product.oldPrice) * 100
      )
    : 0;

  // tone is only for the background colour, so pick it from the position
  const tone = `tone-${(index % 6) + 1}`;
  const outOfStock = product.stock <= 0;

  return (
    <article className="product-card">
      <div className={`product-visual ${tone}`}>
        {discount > 0 && (
          <span className="discount-tag">{discount}% OFF</span>
        )}

        <button
          type="button"
          className={`wish-btn ${liked ? "liked" : ""}`}
          onClick={() => dispatch(toggleFavorite(product))}
          aria-label={liked ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart size={18} />
        </button>

        <Link to={`/products/${product._id}`}>
          {product.image ? (
            <img
              src={`${API}${product.image}`}
              alt={product.name}
              className="product-img"
            />
          ) : (
            <Package size={64} strokeWidth={1.4} />
          )}
        </Link>
      </div>

      <div className="product-info">
        <span className="product-category">{product.category}</span>

        <h3>
          <Link to={`/products/${product._id}`}>{product.name}</Link>
        </h3>

        <div className="product-rating">
          <Stars rating={product.rating || 0} />
          <span>{product.rating || 0}</span>
        </div>

        <div className="product-bottom">
          <div className="price">
            <strong>{formatPrice(product.price)}</strong>
            {product.oldPrice > 0 && (
              <del>{formatPrice(product.oldPrice)}</del>
            )}
          </div>
        </div>

        <div className="card-actions">
          <Link
            to={`/products/${product._id}`}
            className="view-details-btn"
          >
            View Details
          </Link>

          <button
            type="button"
            className="add-cart-btn"
            onClick={() => onAdd(product)}
            disabled={outOfStock}
          >
            <ShoppingCart size={16} />
            {outOfStock ? "Out of stock" : "Add to Cart"}
          </button>
        </div>
      </div>
    </article>
  );
}

/* ---------- Page ---------- */

function Home() {
  const { hours, minutes, seconds } = useCountdown();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const [featured, setFeatured] = useState([]);
  const [arrivals, setArrivals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const [f, n] = await Promise.all([
          fetch(`${API}/api/products?featured=true&limit=8`).then((r) =>
            r.json()
          ),
          fetch(`${API}/api/products?isNewArrival=true&limit=8`).then((r) =>
            r.json()
          ),
        ]);

        setFeatured(Array.isArray(f) ? f : []);
        setArrivals(Array.isArray(n) ? n : []);
      } catch (err) {
        console.error("Failed to load products", err);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  // Add to Cart click -> Redux cart-la serum -> Cart page open aagum
  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
    navigate("/cart");
  };

  const handleSubscribe = (e) => {
    e.preventDefault();

    if (!email.trim()) return;

    // TODO: send email to your backend
    setSubscribed(true);
    setEmail("");
  };

  return (
    <div className="home-page">

      {/* ===== Hero ===== */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge">
            <Tag size={18} />
            <span>Best Quality</span>
            <span>•</span>
            <span>Best Prices</span>
            <span>•</span>
            <span>Fast Delivery</span>
          </div>

          <h1>
            Welcome to
            <br />
            Shop<span>Ease</span>
          </h1>

          <p className="hero-description">
            Discover amazing products, great deals
            and a smooth shopping experience.
          </p>

          <div className="hero-buttons">
            <Link to="/products" className="shop-now">
              <ShoppingCart size={21} />
              Shop Now →
            </Link>

            <Link to="/products" className="view-products">
              View Products
            </Link>
          </div>
        </div>

        <div className="hero-art">
          <div className="art-circle">
            <ShoppingCart size={130} strokeWidth={1.5} />
            <h2>Shop Smart!</h2>
            <p>ShopEase</p>
          </div>
        </div>
      </section>

      {/* ===== Features strip ===== */}
      <section className="home-features">
        <div className="home-feature">
          <Truck size={34} />
          <div>
            <h3>Fast Delivery</h3>
            <p>Products at your doorstep.</p>
          </div>
        </div>

        <div className="home-feature">
          <ShieldCheck size={34} />
          <div>
            <h3>Secure Shopping</h3>
            <p>Safe shopping experience.</p>
          </div>
        </div>

        <div className="home-feature">
          <Headphones size={34} />
          <div>
            <h3>Customer Support</h3>
            <p>We are here to help.</p>
          </div>
        </div>

        <div className="home-feature">
          <Tag size={34} />
          <div>
            <h3>Best Prices</h3>
            <p>Great deals every day.</p>
          </div>
        </div>
      </section>

      {/* ===== Shop by Category ===== */}
      <section className="sx-section">
        <div className="sx-heading">
          <h2>Shop by Category</h2>
          <p>Pick a category and find what you need faster.</p>
        </div>

        <div className="category-grid">
          {categories.map((c) => (
            <Link
              key={c.slug}
              to={`/products?category=${c.slug}`}
              className="category-card"
            >
              <span className="category-icon">
                <c.icon size={32} />
              </span>
              <h3>{c.name}</h3>
              <p>{c.count}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* ===== Featured Products ===== */}
      <section className="sx-section">
        <div className="sx-heading row">
          <div>
            <h2>Featured Products</h2>
            <p>Hand-picked products our customers love.</p>
          </div>

          <Link to="/products" className="see-all">
            See all products
          </Link>
        </div>

        {loading ? (
          <p>Loading products...</p>
        ) : featured.length === 0 ? (
          <p>No featured products yet.</p>
        ) : (
          <div className="product-grid">
            {featured.map((p, i) => (
              <ProductCard
                key={p._id}
                product={p}
                index={i}
                onAdd={handleAddToCart}
              />
            ))}
          </div>
        )}
      </section>

      {/* ===== Deals Banner ===== */}
      <section className="deal-banner">
        <div className="deal-text">
          <span className="deal-pill">
            <Clock size={16} /> Deal of the Day
          </span>

          <h2>Up to 50% OFF on top picks</h2>
          <p>
            Offer ends today. Grab your favourites before time runs out.
          </p>

          <Link to="/products" className="deal-btn">
            Grab the deal
          </Link>
        </div>

        <div className="countdown" aria-label="Time left for the deal">
          <div className="count-box">
            <strong>{pad(hours)}</strong>
            <span>Hours</span>
          </div>

          <div className="count-box">
            <strong>{pad(minutes)}</strong>
            <span>Minutes</span>
          </div>

          <div className="count-box">
            <strong>{pad(seconds)}</strong>
            <span>Seconds</span>
          </div>
        </div>
      </section>

      {/* ===== New Arrivals ===== */}
      <section className="sx-section">
        <div className="sx-heading row">
          <div>
            <h2>New Arrivals</h2>
            <p>Fresh stock, just landed.</p>
          </div>

          <Link to="/products" className="see-all">
            Browse all
          </Link>
        </div>

        {loading ? (
          <p>Loading products...</p>
        ) : arrivals.length === 0 ? (
          <p>No new arrivals yet.</p>
        ) : (
          <div className="arrivals-row">
            {arrivals.map((p, i) => (
              <ProductCard
                key={p._id}
                product={p}
                index={i}
                onAdd={handleAddToCart}
              />
            ))}
          </div>
        )}
      </section>

      {/* ===== Stats ===== */}
      <section className="stats-strip">
        {stats.map((s) => (
          <div className="stat" key={s.label}>
            <s.icon size={30} />
            <strong>{s.value}</strong>
            <span>{s.label}</span>
          </div>
        ))}
      </section>

      {/* ===== Dynamic Testimonials ===== */}
      <Testimonials />

      {/* ===== Newsletter ===== */}
      <section className="newsletter">
        <div>
          <h2>Get offers in your inbox</h2>
          <p>Subscribe and be the first to know about new deals.</p>
        </div>

        {subscribed ? (
          <p className="subscribed-msg">Thanks for subscribing!</p>
        ) : (
          <form className="newsletter-form" onSubmit={handleSubscribe}>
            <Mail size={20} />

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <button type="submit">Subscribe</button>
          </form>
        )}
      </section>

    </div>
  );
}

export default Home;