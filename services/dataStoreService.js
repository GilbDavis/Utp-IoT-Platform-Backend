const logger = require('../helpers/logger');
const { Group, Sensor, SensorData } = require("../models");

class DataCenterService {

  async saveDataCenterData(temperature, humidity, sensorInfo) {
    try {
      const findSensor = await Sensor.findOne({ where: { sensorName: sensorInfo.sensorName }, include: [{ model: Group, as: 'Group', where: { groupName: sensorInfo.sensorGroup } }] });
      if (!findSensor) {
        logger.error("This sensor don't exist in the database");
        throw new Error("Couldn't find the sensor");
      }
      const storedData = await SensorData.create({
        temperature: temperature,
        humidity: humidity,
        sensor_id: findSensor.sensor_id
      });
      if (!storedData) {
        logger.error("An error occurred trying to store DataCenter temperature and humidity");
        throw Error("Unable to store the data, please check your internet connection");
      }
      return storedData;
    } catch (error) {
      logger.error("An error has occurred on saveDataCenterData service");
      throw error;
    }
  }

  async saveLemsTinaData(temperature, sensorInfo) {
    try {
      const findSensor = await Sensor.findOne({ where: { sensorName: sensorInfo.sensorName }, include: [{ model: Group, as: 'Group', where: { groupName: sensorInfo.sensorGroup } }] });
      if (!findSensor) {
        logger.error("This sensor don't exist in the database");
        throw new Error("Couldn't find the sensor");
      }
      const storedData = await SensorData.create({
        temperature: temperature,
        sensor_id: findSensor.sensor_id
      });
      if (!storedData) {
        logger.error("An error occurred trying to store DataCenter temperature and humidity");
        throw Error("Unable to store the data, please check your internet connection");
      }
      return storedData;
    } catch (error) {
      logger.error("An error has occurred on saveDataCenterData service");
      throw error;
    }
  }
}

module.exports = DataCenterService;