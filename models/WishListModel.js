const mongoose = require("mongoose");

const wishlistSchema = mongoose.Schema({
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

const WishlistModel = mongoose.model("wishlist", wishlistSchema);

module.exports = { WishlistModel };
