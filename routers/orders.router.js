const { Router } = require("express");

const { OrderModel } = require("../models/OrderModel");
const { CartModel } = require("../models/CartModel");
const { ProductModel } = require("../models/ProductModel");
const tokenValidator = require("../middlewares/tokenAuth");

const orderRouter = Router();

orderRouter.use(tokenValidator);
orderRouter.post("/place", async function (req, res) {
  let userId = req.body.authId;

  try {
    let cartItems = await CartModel.find({ userId });
    cartItems.forEach((product) => {
      let orderItem = new OrderModel();
      orderItem.userId = req.body.authId;
      orderItem.title = product.title;
      orderItem.price = product.price;
      orderItem.otherImages = product.otherImages;
      orderItem.soldBy = product.soldBy;
      orderItem.adminId = product.adminId;
      orderItem.image = product.image;
      orderItem.category = product.category;
      orderItem.ratings = product.ratings;
      orderItem.productId = product.productId;
      orderItem.quantity = product.quantity;
      orderItem.totalPrice = product.totalPrice;

      orderItem.orderStatus = "Placed";
      orderItem.save();
      //   console.log(orderItem);
    });
    await CartModel.deleteMany({ userId });
    res.send({ msg: "Order Placed Successfully", status: "success" });
  } catch (err) {
    res.send({ msg: "error while placing order", status: "error" });
  }
});

orderRouter.get("/", async (req, res) => {
  let userId = req.body.authId;

  try {
    let orders = await OrderModel.find({ userId });

    res.send({ data: orders, status: "success" });
  } catch (err) {
    res.send({ msg: "error while fetching orders details", status: "error" });
  }
});

orderRouter.patch("/return/:orderId", async (req, res) => {
  let orderId = req.params.orderId;
  let userId = req.body.authId;
  try {
    let resp = await OrderModel.findOneAndUpdate(
      { _id: orderId, userId },
      { orderStatus: "Return Request" }
    );
    if (resp != null) {
      res.send({
        msg: "order return request submitted ",
        status: "success",
      });
    } else {
      res.send({
        msg: "request failed due to invalid operation",
        status: "fail",
      });
    }
  } catch (err) {
    res.send({ msg: "Error while requesting return", status: "error" });
  }
});
orderRouter.patch("/cancel/:orderId", async (req, res) => {
  let orderId = req.params.orderId;
  let userId = req.body.authId;
  try {
    let resp = await OrderModel.findOneAndUpdate(
      { _id: orderId, userId },
      { orderStatus: "cancelled" }
    );
    if (resp != null) {
      res.send({
        msg: "order cancelled successfully ",
        status: "success",
      });
    } else {
      res.send({
        msg: "request failed due to invalid operation",
        status: "fail",
      });
    }
  } catch (err) {
    res.send({ msg: "Error while requesting cancel", status: "error" });
  }
});
module.exports = { orderRouter };
