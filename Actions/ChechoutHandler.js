const mongoose = require("mongoose");
const AbandonedCart = require("../Model/AbandonedCartModel");

const { v1: uuidv1, v4: uuidv4 } = require("uuid");

async function addAbandonedCart(req, res) {
  const newAbandonedCart = new AbandonedCart({
    username: req.body.username,
    email: req.body.email,
    phone: req.body.phone,
    abandonedStatus: true,
    url: req.body.url,
    others: req.body.others,
    count: 0,
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
async function updateAbandonedCartStatus(req, res) {
  const id = req.params.id;
  const update = req.body;
  try {
    const abandonedCart = await AbandonedCart.findByIdAndUpdate(id, update, {
      new: true,
    });
    if (!abandonedCart) {
      return res.status(404).send("Abandoned cart not found");
    }
    res.send(abandonedCart);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
}

module.exports = {
  addAbandonedCart,
  getAbandonedCart,
  updateAbandonedCartStatus,
};
