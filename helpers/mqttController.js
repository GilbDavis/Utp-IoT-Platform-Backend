const logger = require("./logger");
const DataCenterService = require('../services/dataCenterService');
const mqtt = require('mqtt');
const configEnv = require('../config/configEnv');

const mqttInitializer = (io) => {

  // Mqtt Config
  const client = mqtt.connect(configEnv.mqtt_broker);
  client.on("connect", () => {
    logger.debug("MQTT broker is online");
    client.subscribe("DataCenter/room");
  });

  client.on("message", async (topic, message) => {
    switch (topic) {
      case 'DataCenter/room': {
        let sensorData = message.toString().split(","); // Message is divided and transformed into an array -> [temperature, humidity]
        const DataCenterServiceInstance = new DataCenterService();
        const sensorInfo = {
          sensorName: 'dht22',
          sensorGroup: 'DataCenter/room'
        };
        const storedData = await DataCenterServiceInstance.saveDataCenterData(sensorData[0], sensorData[1], sensorInfo);
        logger.info(`Temperatura: ${storedData.temperature}°C y la humedad: ${storedData.humidity}%, creado: ${storedData.createdAt}`);
        return io.emit('DataCenter/room', { id: storedData.data_id, temperature: storedData.temperature, humidity: storedData.humidity, createdAt: storedData.createdAt });
      }
      default: break;
    }
  });


  client.on("error", (err) => {
    logger.error("An error have occurred with the MQTT Broker: ", err);
  })
};

module.exports = mqttInitializer;