
const mongoose = require("mongoose");
const crypto = require("crypto");
const Razorpay = require("razorpay");

const Order = require("../models/orderModel");
const Product = require("../models/productModel");

// Razorpay configuration
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// 1. Create Razorpay payment order
const createOrder = async (req, res) => {
  try {
    const { products } = req.body;

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({
        message: "Products are required",
      });
    }

    let totalAmount = 0;
    const orderProducts = [];

    for (const item of products) {
      const { productId, quantity } = item;

      if (
        !mongoose.Types.ObjectId.isValid(productId) ||
        !Number.isInteger(quantity) ||
        quantity < 1
      ) {
        return res.status(400).json({
          message: "Invalid product ID or quantity",
        });
      }

      const product = await Product.findById(productId);

      if (!product) {
        return res.status(404).json({
          message: "Product not found",
        });
      }

      if (product.stock < quantity) {
        return res.status(400).json({
          message: `Insufficient stock for ${product.name}`,
        });
      }

      totalAmount += product.price * quantity;

      orderProducts.push({
        productId: product._id,
        quantity,
      });
    }

    // Razorpay amount must be in paise
    const amountInPaise = Math.round(totalAmount * 100);

    if (amountInPaise <= 0) {
      return res.status(400).json({
        message: "Invalid order amount",
      });
    }

    // Create order in Razorpay
    const razorpayOrder = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    // Save our order in MongoDB as Pending
    const order = await Order.create({
      userId: req.user.id,
      products: orderProducts,
      totalAmount,
      status: "Pending",
      razorpayOrderId: razorpayOrder.id,
    });

    return res.status(201).json({
      message: "Payment order created successfully",
      order,
      razorpay: {
        key: process.env.RAZORPAY_KEY_ID,
        orderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
      },
    });
  } catch (error) {
    console.error("Create order error:", error);

    return res.status(500).json({
      message: "Failed to create payment order",
    });
  }
};

// 2. Verify Razorpay payment
const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      return res.status(400).json({
        message: "Payment verification details are required",
      });
    }

    // Find this user's order
    const order = await Order.findOne({
      razorpayOrderId: razorpay_order_id,
      userId: req.user.id,
    });

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    // Verify signature using Razorpay secret
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    const expectedBuffer = Buffer.from(expectedSignature);
    const receivedBuffer = Buffer.from(razorpay_signature);

    const signatureValid =
      expectedBuffer.length === receivedBuffer.length &&
      crypto.timingSafeEqual(expectedBuffer, receivedBuffer);

    if (!signatureValid) {
      return res.status(400).json({
        message: "Invalid payment signature",
      });
    }

    // Do not mark an order paid using a different payment ID
    if (order.status === "Paid") {
      if (order.razorpayPaymentId === razorpay_payment_id) {
        return res.status(200).json({
          message: "Payment already verified",
          order,
        });
      }

      return res.status(400).json({
        message: "Order is already paid",
      });
    }

    // Mark as Paid only after signature verification
    order.status = "Paid";
    order.razorpayPaymentId = razorpay_payment_id;
    order.razorpaySignature = razorpay_signature;

    await order.save();

    return res.status(200).json({
      message: "Payment verified successfully",
      order,
    });
  } catch (error) {
    console.error("Verify payment error:", error);

    return res.status(500).json({
      message: "Payment verification failed",
    });
  }
};

// 3. Get logged-in user's orders
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      userId: req.user.id,
    })
      .populate("products.productId")
      .sort({ createdAt: -1 });

    return res.status(200).json(orders);
  } catch (error) {
    console.error("Get orders error:", error);

    return res.status(500).json({
      message: "Failed to fetch orders",
    });
  }
};

module.exports = {
  createOrder,
  verifyPayment,
  getMyOrders,
};
