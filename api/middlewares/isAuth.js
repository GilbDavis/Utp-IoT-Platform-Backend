const jwt = require("jsonwebtoken");
const config = require("../../config/configEnv");
const logger = require("../../helpers/logger");
const error = new Error();

module.exports = (req, res, next) => {
  // Extract the token from header
  const token = req.get("Authorization");
  logger.debug("Extrayendo token...");
  // Check if there is no token
  if (!token) {
    logger.error("No se encontro el token");
    error.statusCode = 401;
    error.data = {
      message: "No se encontro un token, permiso no valido"
    };
    throw next(error);
  }
  logger.debug("Verificando validez del token...");
  // Validate the token if it exist
  try {
    const cifrado = jwt.verify(token, config.jwt_secret);
    req.user = cifrado.user;
    logger.debug("El token fue validado con exito");
    return next();
  } catch (error) {
    logger.warn("El token introducido no es valido");
    error.statusCode = 401;
    error.data = {
      message: "Token no valido"
    };
    throw error;
  }
};