
const Testimonial = require("../models/testimonialModel");
const User = require("../models/userModel");

// GET /api/testimonials?limit=6
const getTestimonials = async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 6;

    const testimonials = await Testimonial.find()
      .sort({ createdAt: -1 })
      .limit(limit);

    res.json(testimonials);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/testimonials/my
const getMyTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findOne({
      user: req.user.id,
    });

    res.json(testimonial);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/testimonials
const addTestimonial = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    if (!rating || !comment || !comment.trim()) {
      return res.status(400).json({
        message: "Rating and comment are required",
      });
    }

    const user = await User.findById(req.user.id).select("name");

    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    const testimonial = await Testimonial.findOneAndUpdate(
      { user: req.user.id },
      {
        name: user.name,
        rating: Number(rating),
        comment: comment.trim(),
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      }
    );

    res.status(201).json(testimonial);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// PUT /api/testimonials/:id
const updateTestimonial = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    if (!rating || !comment || !comment.trim()) {
      return res.status(400).json({
        message: "Rating and comment are required",
      });
    }

    const testimonial = await Testimonial.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user.id,
      },
      {
        rating: Number(rating),
        comment: comment.trim(),
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!testimonial) {
      return res.status(404).json({
        message: "Review not found or you are not authorized",
      });
    }

    res.json({
      message: "Review updated successfully",
      testimonial,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE /api/testimonials/:id
const deleteTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!testimonial) {
      return res.status(404).json({
        message: "Review not found or you are not authorized",
      });
    }

    res.json({
      message: "Review deleted successfully",
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getTestimonials,
  getMyTestimonial,
  addTestimonial,
  updateTestimonial,
  deleteTestimonial,
};
