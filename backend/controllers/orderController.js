
const mongoose = require("mongoose");
const Order = require("../models/orderModel");
const Product = require("../models/productModel");

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

    const order = await Order.create({
      userId: req.user.id,
      products: orderProducts,
      totalAmount,
    });

    return res.status(201).json({
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      userId: req.user.id,
    })
      .populate("products.productId")
      .sort({ createdAt: -1 });

    return res.status(200).json(orders);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
};