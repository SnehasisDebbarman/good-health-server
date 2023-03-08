const express = require("express");
const checkoutStatusRouter = express.Router();

const {
  addAbandonedCart,
  getAbandonedCart,
} = require("../Actions/ChechoutHandler");

checkoutStatusRouter.post("/", addAbandonedCart);

checkoutStatusRouter.get("/", getAbandonedCart);

module.exports = checkoutStatusRouter;
