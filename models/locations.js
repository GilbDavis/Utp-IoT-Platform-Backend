'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Locations extends Model {

    static associate(models) {
      // define association here
      Locations.hasMany(models.Group, {
        foreignKey: 'location_id',
        onDelete: 'SET NULL',
        onUpdate: "CASCADE"
      });
    }
  }

  Locations.init({
    location_id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    locationName: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Locations',
  });
  return Locations;
};