const express = require("express");
const multer = require("multer");

const {
  getProducts,
  getProductById,
  createProduct,
  deleteProduct,
} = require("../controllers/productController");

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {
    cb(
      null,
      Date.now() + "-" + file.originalname
    );
  },
});

const upload = multer({
  storage: storage,
});

router.get("/", getProducts);

router.get("/:id", getProductById);

router.post(
  "/",
  upload.single("image"),
  createProduct
);

router.delete("/:id", deleteProduct);

module.exports = router;