const express = require("express");
const bodyParser = require("body-parser");

const dbConnection = require("./dbConnection");

const dotenv = require("dotenv");
const cors = require("cors");

const checkoutStatusRouter = require("./Router/checkoutStatusRouter");
const { sendMailer } = require("./sendMailer");

const app = express();
dotenv.config();
app.use(cors());

// Parse JSON body
app.use(bodyParser.json());

// Endpoint to receive webhook payloads

app.get("/", (req, res) => {
  res.send("Hello, world!");
});
dbConnection();
sendMailer();

app.use("/abandonedCart", checkoutStatusRouter);

// app.post("/webhook", (req, res) => {
//   const customerData = req.body.customerData;
//   const eventData = req.body.eventData;
//   if (eventType === "checkout_abandoned") {
//     res.send("Hello, world!");
//     // Handle checkout abandonment event
//   } else if (eventType === "order_placed") {
//     // Handle order placed event
//     res.send("Hello, world!");
//   }

//   res.sendStatus(200);
// });

// Start server
app.listen(3000, () => {
  console.log("Webhook listener started on port 3000");
});
