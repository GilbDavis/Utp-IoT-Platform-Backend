const express = require("express");
const config = require("./config/config");
const cors = require("cors");
const morgan = require('morgan');
const app = express();
const mqtt = require('mqtt');

app.use(cors());
app.use(express.json({ extended: true }));
app.use(morgan('dev'));

// app.use(config.api.prefix, require('./api/routes/index'));

// Mqtt Config
const client = mqtt.connect(config.mqtt_broker);
client.on("connect", () => {
  console.log("connected");
  client.subscribe("topic");
});

client.on("message", (topic, message) => {
  if (topic === 'topic') {
    console.log(`La temperatura del cuarto 1 es de: ${message.toString()} C`);
  }
});

client.on("error", () => {
  console.log("Error have occurred");
})
// end of mqtt config

app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});
// Error handling purpose
app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err)
  }
  res.status(err.statusCode || 500).json({ status: "error", errors: err.data });
});

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});