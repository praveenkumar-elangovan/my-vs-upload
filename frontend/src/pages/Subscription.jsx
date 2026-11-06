import { useDispatch, useSelector } from "react-redux";
import { Crown, Check } from "lucide-react";
import { subscribePlan } from "../redux/subscriptionSlice";
import "./Subscription.css";

const plans = [
  {
    key: "free",
    name: "Free",
    price: 0,
    period: "forever",
    perks: [
      "Browse all products",
      "Standard delivery",
      "Basic customer support",
    ],
  },
  {
    key: "monthly",
    name: "Monthly",
    price: 299,
    period: "month",
    perks: [
      "Free delivery on all orders",
      "Early access to deals",
      "Priority customer support",
    ],
  },
  {
    key: "yearly",
    name: "Yearly",
    price: 3399,
    period: "year",
    perks: [
      "Everything in Monthly",
      "Extra 10% off on orders",
      "Exclusive member offers",
    ],
  },
];

export default function Subscription() {
  const dispatch = useDispatch();
  const { isPremium, plan, expiry, loading, error } = useSelector(
    (state) => state.subscription
  );

  const renderButton = (p) => {
    // Free plan: payment illa
    if (p.key === "free") {
      return (
        <button className="sub-btn sub-btn-free" disabled>
          {isPremium ? "Basic Plan" : "Current Plan"}
        </button>
      );
    }

    return (
      <button
        className="sub-btn"
        disabled={loading}
        onClick={() => dispatch(subscribePlan(p.key))}
      >
        {loading
          ? "Processing..."
          : isPremium
          ? "Extend Plan"
          : "Subscribe Now"}
      </button>
    );
  };

  return (
    <div className="sub-page">
      <div className="sub-header">
        <Crown size={44} className="sub-crown" />
        <h1>
          Choose Your <span>Plan</span>
        </h1>
        <p>Start free, upgrade anytime for free delivery and extra discounts.</p>
      </div>

      {isPremium && (
        <div className="sub-active">
          You are on the <strong>{plan}</strong> plan until{" "}
          <strong>{new Date(expiry).toLocaleDateString("en-IN")}</strong>
        </div>
      )}

      {error && <div className="sub-error">{error}</div>}

      <div className="sub-plans">
        {plans.map((p) => (
          <div key={p.key} className="sub-card">
            <h2>{p.name}</h2>

            <p className="sub-price">
              {p.price === 0 ? "Free" : `₹${p.price}`}
              {p.price !== 0 && <small> / {p.period}</small>}
            </p>

            <ul>
              {p.perks.map((perk) => (
                <li key={perk}>
                  <Check size={16} /> {perk}
                </li>
              ))}
            </ul>

            {renderButton(p)}
          </div>
        ))}
      </div>
    </div>
  );
}