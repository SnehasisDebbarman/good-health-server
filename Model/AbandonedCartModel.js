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
    others: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("abobandonedCart", abobandonedCartModel);
