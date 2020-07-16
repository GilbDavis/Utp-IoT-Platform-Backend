// Middlewares and config
const express = require("express");
const configEnv = require("./config/configEnv");
const logger = require("./helpers/logger");
const cors = require("cors");
const morgan = require('morgan');
const http = require('http');
const app = express();
const server = http.createServer(app);
const io = require('./socket').init(server);
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
  client.subscribe("DataCenter/room");
});

client.on("message", async (topic, message) => {
  switch (topic) {
    case 'DataCenter/room': {
      let sensorData = message.toString().split(",");
      const sensorInfo = {
        sensorName: 'dht22',
        sensorGroup: 'DataCenter/room'
      };
      const DataCenterServiceInstance = new DataCenterService();
      const storedData = await DataCenterServiceInstance.saveDataCenterData(sensorData[0], sensorData[1], sensorInfo);
      logger.info(`La temperatura del cuarto 1 es de: ${storedData.temperature}°C y la humedad ${storedData.humidity}%`);
      return io.emit('DataCenter/room', { temperature: storedData.temperature, humidity: storedData.humidity, createdAt: storedData.createdAt });
    }
    default: break;
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

server.listen(configEnv.port, () => {
  logger.info(`Server running on port ${configEnv.port}`);
  io.on('connection', socket => {
    logger.info("A user has connected to the socket");
  });
});

