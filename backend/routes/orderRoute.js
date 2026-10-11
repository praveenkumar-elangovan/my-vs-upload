const express = require("express");

const {
  createOrder,
  getMyOrders,
} = require("../controllers/orderController");

const authMiddleware = require(
  "../middleware/authMiddleware"
);

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  createOrder
);

router.get(
  "/",
  authMiddleware,
  getMyOrders
);

module.exports = router;