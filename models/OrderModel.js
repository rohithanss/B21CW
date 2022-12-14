const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
  quantity: Number,
  totalPrice: Number,
  orderStatus: String,
  productId: String,
  userId: String,
  title: String,
  image: String,
  price: Number,
  ratings: Number,
  adminId: String,
  otherImages: [String],
  category: String,
  soldBy: String,
});

const OrderModel = mongoose.model("order", orderSchema);

module.exports = { OrderModel };
