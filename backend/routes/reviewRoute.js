
const express = require("express");

const {
  getReviews,
  addReview,
  updateReview,
  deleteReview,
} = require("../controllers/reviewController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Get Reviews
router.get("/:id/reviews", getReviews);

// Add Review
router.post("/:id/reviews", authMiddleware, addReview);

// Update Review
router.put("/:id/reviews/:reviewId", authMiddleware, updateReview);

// Delete Review
router.delete("/:id/reviews/:reviewId", authMiddleware, deleteReview);

module.exports = router;
