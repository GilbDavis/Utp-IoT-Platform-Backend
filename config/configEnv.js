const dotenv = require('dotenv');

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const envFound = dotenv.config();
if (envFound.error) {
  throw new Error(".env file was not found");
}

module.exports = {
  port: parseInt(process.env.PORT, 10) || 4000,
  api: {
    prefix: '/api'
  },
  jwt_secret: process.env.SECRETA,
  database: {
    db_host: process.env.DB_HOST,
    db_database: process.env.DB_DATABASE,
    db_user: process.env.DB_USER,
    db_password: process.env.DB_PASSWORD,
    production: {
      db_host: process.env.RDS_HOSTNAME,
      db_dabatase: process.env.RDS_DBNAME,
      db_user: process.env.RDS_USERNAME,
      db_password: process.env.RDS_PASSWORD,
      db_port: process.env.RDS_PORT,
      db_dialect: process.env.RDS_DIALECT
    }
  },
  mqtt_broker: process.env.BROKER
};