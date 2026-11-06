const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  createOrder,
  verifyPayment,
  getStatus,
  getHistory,
} = require("../controllers/subscriptionController");

router.post("/create-order", authMiddleware, createOrder);
router.post("/verify", authMiddleware, verifyPayment);
router.get("/status", authMiddleware, getStatus);
router.get("/history", authMiddleware, getHistory);

module.exports = router;