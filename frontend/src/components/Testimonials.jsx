
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Quote, Star, Pencil, Trash2, X } from "lucide-react";
import "./Testimonials.css";

const API_URL = import.meta.env.VITE_API_URL;

function StarsView({ value }) {
  return (
    <div className="tm-stars">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          size={16}
          color="#f59e0b"
          fill={n <= value ? "#f59e0b" : "none"}
        />
      ))}
    </div>
  );
}

export default function Testimonials() {
  const token = useSelector((state) => state.auth.token);

  const [items, setItems] = useState([]);
  const [myReview, setMyReview] = useState(null);

  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");

  const [editingId, setEditingId] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Load reviews and logged-in user's review
  const loadTestimonials = async () => {
    try {
      const [reviewsRes, myRes] = await Promise.all([
        fetch(`${API_URL}/testimonials?limit=6`),

        token
          ? fetch(`${API_URL}/testimonials/my`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
          : Promise.resolve(null),
      ]);

      const data = await reviewsRes.json();

      let mine = null;

      if (myRes) {
        const myData = await myRes.json();

        if (!myRes.ok) {
          throw new Error(myData.message || "Could not load your review");
        }

        mine = myData;
      }

      setMyReview(mine);

      const reviews = Array.isArray(data) ? data : [];

      // Ensure user's own review is visible even if it is outside latest 6
      if (mine && !reviews.some((t) => t._id === mine._id)) {
        reviews.push(mine);
      }

      setItems(reviews);
    } catch (err) {
      console.error("Failed to load testimonials", err);
    }
  };

  useEffect(() => {
    loadTestimonials();
  }, [token]);

  // Reset form
  const resetForm = () => {
    setRating(0);
    setComment("");
    setEditingId(null);
    setHover(0);
  };

  // Edit button
  const handleEdit = (review) => {
    setEditingId(review._id);
    setRating(review.rating);
    setComment(review.comment);
    setError("");
    setSuccess("");
  };

  // Submit / Update review
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!rating) {
      return setError("Please select a star rating");
    }

    if (!comment.trim()) {
      return setError("Please write your review");
    }

    setSubmitting(true);

    try {
      const isEditing = Boolean(editingId);

      const res = await fetch(
        isEditing
          ? `${API_URL}/testimonials/${editingId}`
          : `${API_URL}/testimonials`,
        {
          method: isEditing ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            rating,
            comment,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Could not submit review");
      }

      resetForm();

      setSuccess(
        isEditing
          ? "Review updated successfully!"
          : "Thank you for your feedback!"
      );

      await loadTestimonials();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Delete review
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your review?"
    );

    if (!confirmDelete) return;

    setError("");
    setSuccess("");

    try {
      const res = await fetch(`${API_URL}/testimonials/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Could not delete review");
      }

      resetForm();

      setSuccess("Review deleted successfully!");

      await loadTestimonials();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section className="sx-section">
      <div className="sx-heading">
        <h2>What Our Customers Say</h2>
        <p>Real feedback from people who shop with ShopEase.</p>
      </div>

      {items.length === 0 ? (
        <p className="tm-empty">
          No reviews yet. Be the first to share your experience!
        </p>
      ) : (
        <div className="testimonial-grid">
          {items.map((t) => (
            <figure className="testimonial" key={t._id}>
              <Quote size={28} className="quote-icon" />

              <blockquote>{t.comment}</blockquote>

              <StarsView value={t.rating} />

              <figcaption>
                <div>
                  <strong>{t.name}</strong>
                  <span>
                    {new Date(t.createdAt).toLocaleDateString("en-IN")}
                  </span>
                </div>
              </figcaption>

              {/* Edit and Delete only for logged-in user's review */}
              {myReview && myReview._id === t._id && (
                <div className="tm-actions">
                  <button
                    type="button"
                    className="tm-edit-btn"
                    onClick={() => handleEdit(t)}
                  >
                    <Pencil size={15} />
                    Edit
                  </button>

                  <button
                    type="button"
                    className="tm-delete-btn"
                    onClick={() => handleDelete(t._id)}
                  >
                    <Trash2 size={15} />
                    Delete
                  </button>
                </div>
              )}
            </figure>
          ))}
        </div>
      )}

      {token ? (
        <form className="tm-form" onSubmit={handleSubmit}>
          <h3>
            {editingId ? "Edit your review" : "Share your experience"}
          </h3>

          <div className="tm-pick" onMouseLeave={() => setHover(0)}>
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                type="button"
                key={n}
                className="tm-pick-btn"
                onMouseEnter={() => setHover(n)}
                onClick={() => setRating(n)}
                aria-label={`${n} star`}
              >
                <Star
                  size={28}
                  color="#f59e0b"
                  fill={n <= (hover || rating) ? "#f59e0b" : "none"}
                />
              </button>
            ))}
          </div>

          <textarea
            rows="4"
            maxLength={300}
            placeholder="Tell us about your experience with ShopEase..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />

          {error && <p className="tm-error">{error}</p>}
          {success && <p className="tm-success">{success}</p>}

          <div className="tm-form-actions">
            <button
              type="submit"
              className="tm-submit"
              disabled={submitting}
            >
              {submitting
                ? "Please wait..."
                : editingId
                ? "Update Review"
                : "Submit Review"}
            </button>

            {editingId && (
              <button
                type="button"
                className="tm-cancel-btn"
                onClick={resetForm}
              >
                <X size={16} />
                Cancel
              </button>
            )}
          </div>
        </form>
      ) : (
        <p className="tm-login">
          Please <Link to="/login">login</Link> to share your experience.
        </p>
      )}
    </section>
  );
}
