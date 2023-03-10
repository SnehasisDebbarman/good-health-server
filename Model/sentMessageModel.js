const mongoose = require("mongoose");

const sentMessageModal = mongoose.Schema(
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
    sendMessage: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    orderId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("sentMessageModal", sentMessageModal);
