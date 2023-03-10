const mongoose = require("mongoose");

const abobandonedCartModel = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    abandonedStatus: {
      type: Boolean,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    others: {
      type: String,
      required: true,
    },
    count: {
      type: Number,
      required: true,
    },
    orderId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("abobandonedCart", abobandonedCartModel);
