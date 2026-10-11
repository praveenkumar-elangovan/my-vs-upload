require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoute = require("./routes/authRoute");
const productRoute = require("./routes/productRoute");
const orderRoute = require("./routes/orderRoute");

const app = express();

app.use(cors());

app.use(express.json());

app.use("/uploads", express.static("uploads"));

app.use("/api", authRoute);

app.use("/api/products", productRoute);

app.use("/api/orders", orderRoute);

app.get("/", (req, res) => {
  res.json({
    message: "E-Commerce Backend Running",
  });
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");

    app.listen(process.env.PORT, () => {
      console.log(
        `Server running on port ${process.env.PORT}`
      );
    });
  })
  .catch((error) => {
    console.log(
      "MongoDB Connection Error:",
      error
    );
  });