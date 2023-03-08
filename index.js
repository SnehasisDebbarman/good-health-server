const express = require("express");
const bodyParser = require("body-parser");

const app = express();

// Parse JSON body
app.use(bodyParser.json());

// Endpoint to receive webhook payloads

app.get("/", (req, res) => {
  res.send("Hello, world!");
});

app.post("/webhook", (req, res) => {
  const eventType = req.body.eventType;
  const eventData = req.body.eventData;
  if (eventType === "checkout_abandoned") {
    res.send("Hello, world!");
    // Handle checkout abandonment event
  } else if (eventType === "order_placed") {
    // Handle order placed event
    res.send("Hello, world!");
  }

  res.sendStatus(200);
});

// Start server
app.listen(3000, () => {
  console.log("Webhook listener started on port 3000");
});
