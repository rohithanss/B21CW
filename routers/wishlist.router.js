const { Router } = require("express");

const { ProductModel } = require("../models/ProductModel");
const { WishlistModel } = require("../models/WishlistModel");
const tokenValidator = require("../middlewares/tokenAuth");

const wishlistRouter = Router();

wishlistRouter.use(tokenValidator);

wishlistRouter.post("/add/:productId", async (req, res) => {
  let productId = req.params.productId;

  try {
    let product = await ProductModel.findById({ _id: productId });
    let wishlistItem = new WishlistModel();
    wishlistItem.userId = req.body.authId;
    wishlistItem.title = product.title;
    wishlistItem.price = product.price;
    wishlistItem.otherImages = product.otherImages;
    wishlistItem.soldBy = product.soldBy;
    wishlistItem.adminId = product.adminId;
    wishlistItem.image = product.image;
    wishlistItem.category = product.category;
    wishlistItem.productId = product._id;
    wishlistItem.ratings = product.ratings;
    await wishlistItem.save();
    res.send({
      msg: "Product added to wishlist successfully",
      status: "success",
    });
  } catch (err) {
    res.send({
      msg: "Error while adding product to the wishlist, try again later",
      status: "error",
    });
  }
});

wishlistRouter.get("/", async (req, res) => {
  const userId = req.body.authId;

  try {
    let wishlist = await WishlistModel.find({ userId });

    res.send({ status: "success", data: wishlist });
  } catch (err) {
    res.send({ msg: "error while fetching wishlist items", status: "error" });
  }
});

wishlistRouter.delete("/delete/:wishlistId", async (req, res) => {
  const userId = req.body.authId;
  const wishlistId = req.params.wishlistId;
  try {
    let item = await WishlistModel.findOneAndDelete({
      _id: wishlistId,
      userId,
    });
    if (item != null) {
      res.send({ msg: "Item deleted successfully", status: "success" });
    } else {
      res.send({ msg: "Invalid operation", status: "fail" });
    }
  } catch (err) {
    res.send({ msg: "error while updating data", status: "error" });
  }
});

module.exports = { wishlistRouter };
