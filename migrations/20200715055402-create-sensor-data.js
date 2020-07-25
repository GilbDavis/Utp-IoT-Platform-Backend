'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('SensorData', {
      data_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      temperature: {
        type: Sequelize.DOUBLE,
        allowNull: true
      },
      humidity: {
        type: Sequelize.DOUBLE,
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      sensor_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Sensors',
          key: 'sensor_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('SensorData');
  }
};