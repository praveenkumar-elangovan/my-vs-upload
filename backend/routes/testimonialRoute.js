
const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");

const {
  getTestimonials,
  getMyTestimonial,
  addTestimonial,
  updateTestimonial,
  deleteTestimonial,
} = require("../controllers/testimonialController");

const router = express.Router();

// Public: Get all reviews
router.get("/", getTestimonials);

// Logged-in user: Get own review
router.get("/my", authMiddleware, getMyTestimonial);

// Logged-in user: Add review
router.post("/", authMiddleware, addTestimonial);

// Logged-in user: Edit own review
router.put("/:id", authMiddleware, updateTestimonial);

// Logged-in user: Delete own review
router.delete("/:id", authMiddleware, deleteTestimonial);

module.exports = router;
