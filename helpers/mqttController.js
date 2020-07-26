const logger = require("./logger");
const DataStoreService = require('../services/dataStoreService');
const mqtt = require('mqtt');
const configEnv = require('../config/configEnv');
const { format } = require("date-fns");

const mqttInitializer = (io) => {

  // Mqtt Config
  const client = mqtt.connect(configEnv.mqtt_broker);
  client.on("connect", () => {
    logger.debug("MQTT broker is online");
    client.subscribe("DataCenter/room/realTime");
    client.subscribe("DataCenter/room");
    client.subscribe("LEMS/tina/realTime");
    client.subscribe("LEMS/tina");
  });

  client.on("message", async (topic, message) => {
    switch (topic) {
      case 'DataCenter/room/realTime': {
        let sensorData = message.toString().split(","); // Message is divided and transformed into an array -> [temperature, humidity]
        return io.emit('DataCenter/room/realTime', { temperature: sensorData[0], humidity: sensorData[1], createdAt: format(new Date(), "hh:mm:ss:a") });
      }
      case "DataCenter/room": {
        let sensorData = message.toString().split(","); // Message is divided and transformed into an array -> [temperature, humidity]
        const DataCenterServiceInstance = new DataStoreService();
        const sensorInfo = {
          sensorName: 'dht22',
          sensorGroup: 'DataCenter/room'
        };
        logger.debug(`Temperatura: ${sensorData[0]}°C y la humedad: ${sensorData[1]}%`);
        return await DataCenterServiceInstance.saveDataCenterData(sensorData[0], sensorData[1], sensorInfo);
      }
      case "LEMS/tina/realTime": {
        const sensorData = message.toString();
        return io.emit('LEMS/tina/realTime', { temperature: sensorData, createdAt: format(new Date(), "hh:mm:ss:a") });
      }
      case "LEMS/tina": {
        const sensorData = message.toString();
        const LemsServiceInstance = new DataStoreService();
        const sensorInfo = {
          sensorName: 'ds18b20',
          sensorGroup: 'Lems/tina'
        };
        logger.info(`La temperatura de la tina es de: ${message.toString()}`);
        return await LemsServiceInstance.saveLemsTinaData(sensorData, sensorInfo);
      }
      default: break;
    }
  });


  client.on("error", (err) => {
    logger.error("An error have occurred with the MQTT Broker: ", err);
  })
};

module.exports = mqttInitializer;