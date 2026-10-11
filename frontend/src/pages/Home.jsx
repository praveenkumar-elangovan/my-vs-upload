
import { Link } from "react-router-dom";
import {
  ShoppingCart,
  Truck,
  ShieldCheck,
  Headphones,
  Tag,
} from "lucide-react";

import "./Home.css";

function Home() {
  return (
    <div className="home-page">
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
    </div>
  );
}

export default Home;
