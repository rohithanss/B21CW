const { Router } = require("express");

const { ProductModel } = require("../models/ProductModel");
const { CartModel } = require("../models/CartModel");
const tokenValidator = require("../middlewares/tokenAuth");

const cartRouter = Router();

cartRouter.use(tokenValidator);

cartRouter.post("/add/:productId", async (req, res) => {
  let productId = req.params.productId;
  let quantity = req.query.quantity;

  try {
    let product = await ProductModel.findById({ _id: productId });
    // console.log(product);
    let cartItem = new CartModel({ quantity });

    cartItem.userId = req.body.authId;
    cartItem.title = product.title;
    cartItem.price = product.price;
    cartItem.otherImages = product.otherImages;
    cartItem.soldBy = product.soldBy;
    cartItem.adminId = product.adminId;
    cartItem.image = product.image;
    cartItem.category = product.category;
    cartItem.ratings = product.ratings;
    cartItem.productId = product._id;

    cartItem.totalPrice = product.price * quantity;
    let resp = await cartItem.save();
    res.send({ msg: "Product added to cart successfully", status: "success" });
  } catch (err) {
    res.send({
      msg: "Error while adding product to the cart, try again later",
      status: "error",
    });
  }
});

cartRouter.get("/", async (req, res) => {
  const userId = req.body.authId;

  try {
    let cart = await CartModel.find({ userId });
    res.send({ status: "success", data: cart });
  } catch (err) {
    res.send({ msg: "error while fetching cart items", status: "error" });
  }
});

cartRouter.patch("/update/:cartId", async (req, res) => {
  const userId = req.body.authId;
  const cartId = req.params.cartId;
  const quantity = req.query.quantity;
  try {
    let item = await CartModel.findOne({ _id: cartId, userId });
    if (item != null) {
      let totalPrice = (item.totalPrice / item.quantity) * quantity;
      console.log(totalPrice);
      await CartModel.findByIdAndUpdate(
        { _id: cartId },
        { totalPrice, quantity }
      );

      res.send({ msg: "cart updated successfully", status: "success" });
    } else {
      res.send({ msg: "Invalid operation", status: "fail" });
    }
  } catch (err) {
    res.send({ msg: "error while updating data", status: "error" });
  }
});

cartRouter.delete("/delete/:cartId", async (req, res) => {
  const userId = req.body.authId;
  const cartId = req.params.cartId;
  try {
    let item = await CartModel.findOneAndDelete({ _id: cartId, userId });
    if (item != null) {
      res.send({ msg: "Item deleted successfully", status: "success" });
    } else {
      res.send({ msg: "Invalid operation", status: "fail" });
    }
  } catch (err) {
    res.send({ msg: "error while updating data", status: "error" });
  }
});

module.exports = { cartRouter };
