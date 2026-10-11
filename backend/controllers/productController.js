const Product = require("../models/productModel");

const getProducts = async (req, res) => {
  try {

    const products = await Product.find();

    res.json(products);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};


const getProductById = async (req, res) => {
  try {

    const product = await Product.findById(
      req.params.id
    );

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.json(product);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};


const createProduct = async (req, res) => {
   console.log("BODY:", req.body);
    console.log("FILE:", req.file);

  try {
    const {
      name,
      description,
      price,
      category,
      stock,
    } = req.body;

    if (!req.file) {
      return res.status(400).json({
        message: "Image is required",
      });
    }

    const product = await Product.create({
      name,
      description,
      price,
      category,
      stock,
      image: `/uploads/${req.file.filename}`,
    });

    res.status(201).json(product);

  } catch (error) {
    console.log("CREATE PRODUCT ERROR:", error);
  }
};
const deleteProduct = async (req, res) => {
  try {

    const product =
      await Product.findByIdAndDelete(
        req.params.id
      );

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.json({
      message: "Product deleted",
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};


module.exports = {
  getProducts,
  getProductById,
  createProduct,
  deleteProduct,
};