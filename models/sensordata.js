'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SensorData extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      SensorData.belongsTo(models.Sensor);
    }
  }

  SensorData.init({
    data_id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    temperature: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    humidity: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    climate: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'SensorData',
  });
  return SensorData;
};