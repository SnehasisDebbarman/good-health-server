const mongoose = require("mongoose");
const sentMessageModel = require("../Model/sentMessageModel");

async function getSentMessages(req, res) {
  sentMessageModel.find((err, posts) => {
    if (err) {
      console.error(err);
      return res.status(404).send("Error retrieving message");
    } else {
      return res.json(posts);
    }
  });
}

module.exports = {
  getSentMessages,
};
