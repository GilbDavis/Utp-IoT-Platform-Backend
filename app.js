// Middlewares and config
const express = require("express");
const configEnv = require("./config/configEnv");
const logger = require("./helpers/logger");
const cors = require("cors");
const morgan = require('morgan');
const app = express();
const mqtt = require('mqtt');

// Services
const DataCenterService = require('./services/dataCenterService');

app.use(cors());
app.use(express.json({ extended: true }));
app.use(morgan('combined'));

// Mqtt Config
const client = mqtt.connect(configEnv.mqtt_broker);
client.on("connect", () => {
  logger.debug("MQTT broker is online");
  client.subscribe("DataCenter/datas");
});

client.on("message", async (topic, message) => {
  if (topic === 'DataCenter/datas') {
    let sensorData = message.toString().split(",");
    const sensorInfo = {
      sensorName: 'dht22',
      sensorGroup: 'DataCenter/room'
    };

    const DataCenterServiceInstance = new DataCenterService();
    const storedData = await DataCenterServiceInstance.saveDataCenterData(sensorData[0], sensorData[1], sensorInfo);
    logger.info(`La temperatura del cuarto 1 es de: ${storedData.temperature}°C y la humedad ${storedData.humidity}%`);
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
}); //End of mqtt configuration

// app.use(config.api.prefix, require('./api/routes/index'));

// Error handling purpose
app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err)
  }
  res.status(err.statusCode || 500).json({ status: "error", errors: err.data });
});

app.listen(configEnv.port, async () => {
  logger.debug(`Server running on port ${configEnv.port}`);
});