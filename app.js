const express = require("express");
const config = require("./config/config");
const sequelize = require('./config/db');
const logger = require("./helpers/logger");
// Probar el logger
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
  client.subscribe("DataCenter/datas");
});

client.on("message", (topic, message) => {
  if (topic === 'DataCenter/datas') {
    let sensorData = message.toString().split(",");
    logger.info(`La temperatura del cuarto 1 es de: ${sensorData[0]}°C y la humedad ${sensorData[1]}%`);
  }
});

client.on("error", (err) => {
  logger.error("An error have occurred with the MQTT Broker: ", err);
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

app.listen(config.port, async () => {
  console.log(`Server running on port ${config.port}`);
  sequelize.authenticate()
    .then(() => {
      console.log("Conexion establecida con la base de datos");
    })
    .catch(error => {
      logger.error(`An error ocurred while trying to establish a connection with the database: ${error}`);
    });
});