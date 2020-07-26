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
    "username": configEnv.database.production.db_user,
    "password": configEnv.database.production.db_password,
    "database": configEnv.database.production.db_dabatase,
    "host": configEnv.database.production.db_host,
    "dialect": configEnv.database.production.db_dialect,
    "port": configEnv.database.production.db_port,
    "timezone": "-05:00"
  }
};