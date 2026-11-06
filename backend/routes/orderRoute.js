
const express = require("express");

const {
  createOrder,
  verifyPayment,
  getMyOrders,
} = require("../controllers/orderController");

const authMiddleware = require(
  "../middleware/authMiddleware"
);

const router = express.Router();

// Create Razorpay order
router.post(
  "/",
  authMiddleware,
  createOrder
);

// Verify Razorpay payment
router.post(
  "/verify-payment",
  authMiddleware,
  verifyPayment
);

// Get logged-in user's orders
router.get(
  "/",
  authMiddleware,
  getMyOrders
);

module.exports = router;
