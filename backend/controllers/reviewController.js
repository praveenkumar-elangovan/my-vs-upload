
const mongoose = require("mongoose");
const Review = require("../models/reviewModel");
const Product = require("../models/productModel");
const User = require("../models/userModel");

// Product average rating + review count update
const updateProductRating = async (productId) => {
  const stats = await Review.aggregate([
    {
      $match: {
        product: new mongoose.Types.ObjectId(productId),
      },
    },
    {
      $group: {
        _id: "$product",
        avg: { $avg: "$rating" },
        count: { $sum: 1 },
      },
    },
  ]);

  const avg = stats.length
    ? Math.round(stats[0].avg * 10) / 10
    : 0;

  const count = stats.length ? stats[0].count : 0;

  await Product.findByIdAndUpdate(productId, {
    rating: avg,
    numReviews: count,
  });
};

// GET all reviews
const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({
      product: req.params.id,
    }).sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET logged-in user's review
const getMyReview = async (req, res) => {
  try {
    const review = await Review.findOne({
      product: req.params.id,
      user: req.user.id,
    });

    res.json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST new review
const addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    if (!rating || !comment || !comment.trim()) {
      return res.status(400).json({
        message: "Rating and comment venum",
      });
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    const user = await User.findById(req.user.id).select("name");

    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    const already = await Review.findOne({
      product: req.params.id,
      user: req.user.id,
    });

    if (already) {
      return res.status(400).json({
        message: "Neenga already indha product-ku review kuduthutteenga",
      });
    }

    const review = await Review.create({
      product: req.params.id,
      user: req.user.id,
      name: user.name,
      rating: Number(rating),
      comment: comment.trim(),
    });

    await updateProductRating(req.params.id);

    res.status(201).json(review);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// PUT update own review
const updateReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    if (!rating || !comment || !comment.trim()) {
      return res.status(400).json({
        message: "Rating and comment venum",
      });
    }

    const review = await Review.findOne({
      _id: req.params.reviewId,
      product: req.params.id,
      user: req.user.id,
    });

    if (!review) {
      return res.status(404).json({
        message: "Review not found or unauthorized",
      });
    }

    review.rating = Number(rating);
    review.comment = comment.trim();

    await review.save();

    await updateProductRating(req.params.id);

    res.json({
      message: "Review updated successfully",
      review,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE own review
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findOne({
      _id: req.params.reviewId,
      product: req.params.id,
      user: req.user.id,
    });

    if (!review) {
      return res.status(404).json({
        message: "Review not found or unauthorized",
      });
    }

    await review.deleteOne();

    await updateProductRating(req.params.id);

    res.json({
      message: "Review deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getReviews,
  getMyReview,
  addReview,
  updateReview,
  deleteReview,
};
