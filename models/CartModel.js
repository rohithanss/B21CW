const mongoose = require("mongoose");

const cartSchema = mongoose.Schema({
  quantity: Number,
  totalPrice: Number,
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

const CartModel = mongoose.model("cart", cartSchema);

module.exports = { CartModel };
