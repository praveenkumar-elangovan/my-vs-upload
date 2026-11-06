
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Star } from "lucide-react";

import {
  fetchReviews,
  addReview,
  updateReview,
  deleteReview,
} from "../redux/reviewSlice";

import "./Review.css";

// Display Stars
function StarsView({ value }) {
  return (
    <span className="rv-stars">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          size={16}
          color="#f59e0b"
          fill={n <= value ? "#f59e0b" : "none"}
        />
      ))}
    </span>
  );
}

export default function Review({ productId, onChange }) {
  const dispatch = useDispatch();

  // Redux State
  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth.user);

  const {
    reviews,
    loading,
    error: reviewError,
  } = useSelector((state) => state.reviews);

  // Add Review States
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Edit Review States
  const [editingId, setEditingId] = useState(null);
  const [editRating, setEditRating] = useState(0);
  const [editHover, setEditHover] = useState(0);
  const [editComment, setEditComment] = useState("");
  const [updating, setUpdating] = useState(false);

  // Delete State
  const [deletingId, setDeletingId] = useState(null);

  // Current User ID
  const currentUserId = user?._id || user?.id;

  // Fetch Reviews
  useEffect(() => {
    dispatch(fetchReviews(productId));
  }, [dispatch, productId]);

  // Add Review
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!rating) {
      return setError("Please select a star rating");
    }

    if (!comment.trim()) {
      return setError("Please write a review");
    }

    setSubmitting(true);

    try {
      await dispatch(
        addReview({
          productId,
          reviewData: {
            rating,
            comment: comment.trim(),
          },
          token,
        })
      ).unwrap();

      setRating(0);
      setHover(0);
      setComment("");

      if (onChange) onChange();

    } catch (err) {
      setError(
        typeof err === "string"
          ? err
          : err.message || "Could not submit review"
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Start Editing
  const handleEdit = (review) => {
    setEditingId(review._id);
    setEditRating(review.rating);
    setEditComment(review.comment);
    setEditHover(0);
    setError("");
  };

  // Cancel Editing
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditRating(0);
    setEditComment("");
    setEditHover(0);
    setError("");
  };

  // Update Review
  const handleUpdate = async (reviewId) => {
    setError("");

    if (!editRating) {
      return setError("Please select a star rating");
    }

    if (!editComment.trim()) {
      return setError("Please write a review");
    }

    setUpdating(true);

    try {
      await dispatch(
        updateReview({
          productId,
          reviewId,
          reviewData: {
            rating: editRating,
            comment: editComment.trim(),
          },
          token,
        })
      ).unwrap();

      handleCancelEdit();

      if (onChange) onChange();

    } catch (err) {
      setError(
        typeof err === "string"
          ? err
          : err.message || "Failed to update review"
      );
    } finally {
      setUpdating(false);
    }
  };

  // Delete Review
  const handleDelete = async (reviewId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this review?"
    );

    if (!confirmDelete) return;

    setError("");
    setDeletingId(reviewId);

    try {
      await dispatch(
        deleteReview({
          productId,
          reviewId,
          token,
        })
      ).unwrap();

      if (editingId === reviewId) {
        handleCancelEdit();
      }

      if (onChange) onChange();

    } catch (err) {
      setError(
        typeof err === "string"
          ? err
          : err.message || "Failed to delete review"
      );
    } finally {
      setDeletingId(null);
    }
  };

  // Average Rating
  const average = reviews.length
    ? (
        reviews.reduce((sum, review) => sum + review.rating, 0) /
        reviews.length
      ).toFixed(1)
    : "0.0";

  return (
    <section className="rv-section">

      <h2 className="rv-title">Customer Reviews</h2>

      <p className="rv-summary">
        <strong>{average}</strong> / 5 · {reviews.length}{" "}
        {reviews.length === 1 ? "review" : "reviews"}
      </p>

      {/* Add Review Form */}
      {token ? (
        <form className="rv-form" onSubmit={handleSubmit}>
          <h3>Write a review</h3>

          <div
            className="rv-pick"
            onMouseLeave={() => setHover(0)}
          >
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                type="button"
                key={n}
                className="rv-pick-btn"
                onMouseEnter={() => setHover(n)}
                onClick={() => setRating(n)}
                aria-label={`${n} star`}
              >
                <Star
                  size={28}
                  color="#f59e0b"
                  fill={
                    n <= (hover || rating)
                      ? "#f59e0b"
                      : "none"
                  }
                />
              </button>
            ))}
          </div>

          <textarea
            rows="4"
            placeholder="Share your thoughts about this product..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />

          {error && (
            <p className="rv-error">{error}</p>
          )}

          <button
            type="submit"
            className="rv-submit"
            disabled={submitting}
          >
            {submitting ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      ) : (
        <p className="rv-login">
          Please <Link to="/login">login</Link> to write a review.
        </p>
      )}

      {/* Reviews List */}
      <div className="rv-list">

        {loading ? (
          <p className="rv-empty">Loading reviews...</p>
        ) : reviewError ? (
          <p className="rv-error">{reviewError}</p>
        ) : reviews.length === 0 ? (
          <p className="rv-empty">
            No reviews yet. Be the first to review!
          </p>
        ) : (
          reviews.map((r) => {

            // Review Owner Check
            const reviewUserId =
              typeof r.user === "object"
                ? r.user?._id
                : r.user;

            const isOwner =
              currentUserId &&
              reviewUserId &&
              String(currentUserId) === String(reviewUserId);

            return (
              <article className="rv-item" key={r._id}>

                <div className="rv-head">
                  <div>
                    <strong>{r.name}</strong>
                    <StarsView value={r.rating} />
                  </div>

                  <time className="rv-date">
                    {new Date(r.createdAt).toLocaleDateString("en-IN")}
                  </time>
                </div>

                {/* Edit Form */}
                {editingId === r._id ? (

                  <div className="rv-edit-form">

                    <div
                      className="rv-pick"
                      onMouseLeave={() => setEditHover(0)}
                    >
                      {[1, 2, 3, 4, 5].map((n) => (
                        <button
                          type="button"
                          key={n}
                          className="rv-pick-btn"
                          onMouseEnter={() => setEditHover(n)}
                          onClick={() => setEditRating(n)}
                          aria-label={`${n} star`}
                        >
                          <Star
                            size={25}
                            color="#f59e0b"
                            fill={
                              n <= (editHover || editRating)
                                ? "#f59e0b"
                                : "none"
                            }
                          />
                        </button>
                      ))}
                    </div>

                    <textarea
                      rows="4"
                      value={editComment}
                      onChange={(e) =>
                        setEditComment(e.target.value)
                      }
                    />

                    <div className="rv-actions">

                      <button
                        type="button"
                        className="rv-save"
                        onClick={() => handleUpdate(r._id)}
                        disabled={updating}
                      >
                        {updating ? "Saving..." : "Save Changes"}
                      </button>

                      <button
                        type="button"
                        className="rv-cancel"
                        onClick={handleCancelEdit}
                        disabled={updating}
                      >
                        Cancel
                      </button>

                    </div>
                  </div>

                ) : (

                  <>
                    <p className="rv-comment">
                      {r.comment}
                    </p>

                    {/* Edit and Delete Buttons */}
                    {isOwner && (
                      <div className="rv-actions">

                        <button
                          type="button"
                          className="rv-edit"
                          onClick={() => handleEdit(r)}
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          className="rv-delete"
                          onClick={() => handleDelete(r._id)}
                          disabled={deletingId === r._id}
                        >
                          {deletingId === r._id
                            ? "Deleting..."
                            : "Delete"}
                        </button>

                      </div>
                    )}
                  </>
                )}

              </article>
            );
          })
        )}

      </div>

    </section>
  );
}
