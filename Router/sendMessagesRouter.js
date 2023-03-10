const express = require("express");
const sentMessagesRouter = express.Router();

const { getSentMessages } = require("../Actions/SendMessageHandler");

sentMessagesRouter.get("/", getSentMessages);

module.exports = sentMessagesRouter;
