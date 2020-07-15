'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Sensor extends Model {

    static associate(models) {
      // define association here
      Sensor.belongsTo(models.Group);
      Sensor.hasMany(models.SensorData, {
        foreignKey: 'sensor_id',
        onDelete: 'SET NULL',
        onUpdate: "CASCADE"
      });
    }
  }

  Sensor.init({
    sensor_id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    sensorName: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Sensor',
    timestamps: true
  });
  return Sensor;
};