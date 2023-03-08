const dotenv = require("dotenv");
dotenv.config();

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
module.exports = async function dbConnection() {
  const mongoURI = process.env.MONGODB_URI;

  try {
    mongoose
      .connect(mongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => console.log("db running"));
  } catch (error) {
    console.error(error);
  }
};
