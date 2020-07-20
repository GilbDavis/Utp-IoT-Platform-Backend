const jwt = require("jsonwebtoken");
const logger = require('../helpers/logger');
const bcrypt = require('bcryptjs');
const { User } = require("../models");
const configEnv = require('../config/configEnv');
const error = new Error();

class UserService {

  async login(email, password) {
    try {
      const user = await User.findOne({ where: { email: email } });
      if (!user) {
        logger.error(`User ${email} not found.`);
        error.statusCode = 400;
        error.data = {
          message: "Email no encontrado"
        };
        throw error;
      }
      logger.debug(`User ${email} has been found`);

      const userPasswordVerification = await bcrypt.compare(password, user.password);
      if (!userPasswordVerification) {
        logger.error(`User ${email} tried to login with an incorrect password`);
        error.statusCode = 400;
        error.data = {
          message: "Contraseña incorrecta"
        };
        throw error;
      }
      const payload = {
        user: {
          id: user.user_id
        }
      };
      const token = jwt.sign(payload, configEnv.jwt_secret, {
        expiresIn: '1h'
      });
      if (!token) {
        logger.error("An error has occurred while generating the token");
        throw new Error("Ocurrio un error en el servidor");
      }
      logger.debug("Token has been generated");
      logger.info(`User ${email} has logged in`);

      return { token: token };
    } catch (error) {
      logger.error(`An error occurred in userService login service: ${error}`)
      throw error;
    }
  }

  async SignUp(userDTO) { //DTO -> Data Object
    try {
      const salt = await bcrypt.genSalt(10);
      userDTO.password = await bcrypt.hash(userDTO.password, salt);

      const user = await User.create(userDTO);
      if (!user) {
        logger.error("User creation failed");
        throw new Error("Ha ocurrido un error al crear el usuario");
      }
      logger.info(`User ${user.email} has been created`);

      const payload = {
        user: {
          id: user.user_id
        }
      };
      const token = jwt.sign(payload, configEnv.jwt_secret, {
        expiresIn: '1h'
      });
      logger.debug("Token has been generated");

      return { token: token };
    } catch (error) {
      logger.error(`An error occurred in userService signup service: ${error}`);
      throw error;
    }
  }

  async userIsAuthenticated(userId) {
    try {
      const user = await User.findByPk(userId, { attributes: { exclude: ['password'] } },);
      return user;
    } catch (error) {
      logger.error("Ocurrio un error en el servicio usuarioAutenticado");
      throw error;
    }
  }
}

module.exports = UserService;