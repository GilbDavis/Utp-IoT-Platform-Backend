const dotenv = require('dotenv');

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const envFound = dotenv.config();
if (envFound.error) {
  throw new Error("No se encontro el archivo .env");
}

module.exports = {
  port: parseInt(process.env.PORT, 10) || 4000,
  api: {
    prefix: '/api'
  },
  jwt_secret: process.env.SECRETA,
  mqtt_broker: process.env.BROKER
};