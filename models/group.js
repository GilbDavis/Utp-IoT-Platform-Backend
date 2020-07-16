'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Group extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Group.hasMany(models.Sensor, {
        foreignKey: 'group_id',
        as: 'Group',
        onDelete: 'SET NULL',
        onUpdate: "CASCADE"
      });

      Group.belongsTo(models.Locations, {
        foreignKey: 'location_id'
      });
    }
  }

  Group.init({
    group_id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    groupName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
  }, {
    sequelize,
    modelName: 'Group',
  });
  return Group;
};