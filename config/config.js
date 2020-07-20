const configEnv = require('./configEnv');

module.exports = {
  "development": {
    "username": configEnv.database.db_user,
    "password": configEnv.database.db_password,
    "database": `${configEnv.database.db_database}_development`,
    "host": configEnv.database.db_host,
    "dialect": "mysql"
  },
  "test": {
    "username": configEnv.database.db_user,
    "password": configEnv.database.db_password,
    "database": `${configEnv.database.db_database}_test`,
    "host": configEnv.database.db_host,
    "dialect": "mysql"
  },
  "production": {
    "username": "root",
    "password": null,
    "database": "database_production",
    "host": "127.0.0.1",
    "dialect": "mysql"
  }
};