const dataStoreService = require('../../services/dataStoreService');
const dataStoreServiceInstance = new dataStoreService();

describe("Data storage services tests", () => {
  test("Should insert temperature and humidity of dht22 to SensorData table", async () => {
    const mockingData = {
      temperature: 25.06,
      humidity: 65.97,
      sensorInfo: {
        sensorName: 'dht22',
        sensorGroup: 'DataCenter/room'
      }
    };

    const insertDataCenter = await dataStoreServiceInstance.
      saveDataCenterData(mockingData.temperature, mockingData.humidity,
        mockingData.sensorInfo);

    expect(typeof insertDataCenter.data_id).toBe('number');
    expect(insertDataCenter).toBeDefined();
  });

  // Error test

  test("Should throw an error in case the wrong sensorInfo is being searched", async () => {
    const mockingData = {
      temperature: 25.06,
      humidity: 65.97,
      sensorInfo: {
        sensorName: 'dht2',
        sensorGroup: 'DataCenter/room'
      }
    };

    await expect(() => dataStoreServiceInstance
      .saveDataCenterData(mockingData.temperature, mockingData.humidity,
        mockingData.sensorInfo)).rejects.toThrow();
  });

  test("It should insert temperature of DS18B20 to SensorData table", async () => {
    const mockingData = {
      temperature: 18,
      sensorInfo: {
        sensorName: 'ds18b20',
        sensorGroup: 'LEMS/tina'
      }
    };

    const insertLemsData = await dataStoreServiceInstance.saveLemsTinaData(mockingData.temperature, mockingData.sensorInfo);

    expect(typeof insertLemsData.data_id).toBe('number');
    expect(insertLemsData).toBeDefined();
  });

  // Error test
  test("Should throw an error in case the wrong sensorInfo is being searched", async () => {
    const mockingData = {
      temperature: 18,
      sensorInfo: {
        sensorName: 'ds18b2',
        sensorGroup: 'LEMS/tina'
      }
    };

    await expect(() => dataStoreServiceInstance.
      saveLemsTinaData(mockingData.temperature, mockingData.sensorInfo))
      .rejects.toThrow();
  });
});