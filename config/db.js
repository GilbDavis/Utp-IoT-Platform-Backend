const config = require('./config');
const Sequelize = require('sequelize');


const sequelize = new Sequelize(config.database.db_database, config.database.db_user, config.database.db_password, {
  dialect: 'mysql',
  host: config.database.db_host
});

module.exports = sequelize;