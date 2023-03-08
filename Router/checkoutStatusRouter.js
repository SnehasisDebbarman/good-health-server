const express = require("express");
const checkoutStatusRouter = express.Router();

const {
  addAbandonedCart,
  getAbandonedCart,
  updateAbandonedCartStatus,
} = require("../Actions/ChechoutHandler");

checkoutStatusRouter.post("/", addAbandonedCart);

checkoutStatusRouter.get("/", getAbandonedCart);

checkoutStatusRouter.put("/:id", updateAbandonedCartStatus);

module.exports = checkoutStatusRouter;
