const express = require("express");
const configEnv = require("./config/configEnv");
const logger = require("./helpers/logger");
const cors = require("cors");
const morgan = require('morgan');
const app = express();
const mqtt = require('mqtt');
const { Group, Sensor } = require("./models");

app.use(cors());
app.use(express.json({ extended: true }));
app.use(morgan('dev'));

// app.use(config.api.prefix, require('./api/routes/index'));

// Creating associated data example with async await
// const testDB = async () => {
//   try {
//     return await Group.update({ groupName: 'LEMS/TinaCurado' }, {
//       where: {
//         group_id: 1
//       }
//     });
//   } catch (error) {
//     console.log(error);
//   }
// };

// Mqtt Config
const client = mqtt.connect(configEnv.mqtt_broker);
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

app.listen(configEnv.port, async () => {
  console.log(`Server running on port ${configEnv.port}`);
});