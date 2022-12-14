const { Router } = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const tokenValidator = require("../middlewares/tokenAuth");
const { AdminModel } = require("../models/AdminModel");
const { ProductModel } = require("../models/ProductModel");

const adminRouter = Router();

adminRouter.post("/login", async (req, res) => {
  let payload = req.body;

  let admin = await AdminModel.findOne({ email: payload.email });
  if (!admin.email) {
    res.send({ msg: "Wrong Credentials", status: "fail" });
  } else {
    try {
      bcrypt.compare(payload.password, admin.password, async (err, result) => {
        if (err) {
          console.log(err);
          res.send({
            msg: "Some error occurred while logging in, try again later",
            status: "error",
          });
        } else {
          if (result) {
            let authId = admin._id;
            let token = jwt.sign({ authId }, process.env.secret_key);

            res.send({ msg: "log in success", status: "success", token });
          } else {
            res.send({ msg: "Wrong Credentials", status: "fail" });
          }
        }
      });
    } catch (err) {
      console.log(err);
      res.send({
        msg: "Some error occurred while logging in, try again later",
        status: "error",
      });
    }
  }
});

adminRouter.use(tokenValidator);

adminRouter.get("/orders", (req, res) => {
  res.send({ orders: [], customers: [], status: "success" });
});

adminRouter.get("/myprofile", async (req, res) => {
  try {
    let profile = await AdminModel.findOne({ _id: req.body.authId });

    res.send({ full_name: profile.name, email: profile.email });
  } catch (err) {
    console.log(err);
    res.send({ msg: "Error at fetching profile", status: "error" });
  }
});

adminRouter.get("/products", async (req, res) => {
  let limit = req.query.limit || null;
  let skip = (req.query.page - 1) * limit;
  let start = skip + 1;
  let end = +skip + +limit;
  try {
    let products = await ProductModel.find({ authId: req.body.authId })
      .limit(limit)
      .skip(skip);
    let totalProducts = await ProductModel.countDocuments();
    res.send({
      status: "success",
      products,
      totalProducts,
      start,
      end: end == 0 ? totalProducts : end,
    });
  } catch (err) {
    console.log(err);
    res.send({ msg: "error while fetching products", status: "error" });
  }
});

// ========================== EXTRA Routers =======================

adminRouter.post("/addmanyproducts", async (req, res) => {
  let payload = req.body;
  res.send({ msg: "this end is blocked temporary" });
  return;
  try {
    let profile = await AdminModel.findOne({ _id: req.body.authId });
    let products = payload.products;
    products.forEach((el) => {
      el.authId = payload.authId;
      el.soldBy = profile.name;
      el.stock = 55;
    });

    await ProductModel.insertMany(products);
    res.send({ msg: "products added successfully", status: "success" });
  } catch (err) {
    res.send({
      msg: "Error while uploading products!try again.",
      status: "error",
    });
  }
});
adminRouter.post("/updatemanyproducts", async (req, res) => {
  let payload = req.query;
  res.send({ msg: "this end is blocked temporary" });
  return;
  try {
    let resp = await ProductModel.updateMany(
      { category: payload.category },
      { $set: { stock: payload.stock } }
    );
    console.log("resp:", resp);
    res.send({ msg: "products Updated successfully", status: "success" });
  } catch (err) {
    res.send({
      msg: "Error while uploading products!try again.",
      status: "error",
    });
  }
});
module.exports = { adminRouter };
