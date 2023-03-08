const mongoose = require("mongoose");
const AbandonedCart = require("../Model/AbandonedCartModel");

async function addAbandonedCart(req, res) {
  const newAbandonedCart = new AbandonedCart({
    username: req.body.username,
    email: req.body.email,
    phone: req.body.phone,
    abandonedStatus: true,
  });

  // Save the post to the database
  newAbandonedCart.save((err, post) => {
    if (err) {
      console.error(err);
      return res.status(403).send("error: " + err.message);
    } else {
      return res.send("successful");
    }
  });
}

async function getAbandonedCart(req, res) {
  AbandonedCart.find((err, posts) => {
    if (err) {
      console.error(err);
      return res.status(404).send("Error retrieving abandoned cart");
    } else {
      return res.json(posts);
    }
  });
}

module.exports = {
  addAbandonedCart,
  getAbandonedCart,
};
