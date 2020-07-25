const UserService = require('../../services/userService');
const { validationResult } = require("express-validator");
const logger = require('../../helpers/logger')
const error = new Error();

exports.loginUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.warn("Validation error in loginUser controller: ", errors.array());
    error.statusCode = 400;
    error.data = errors.array();
    return next(error);
  }

  const { email, password } = req.body;
  const userServiceInstance = new UserService();

  try {
    const { token } = await userServiceInstance.login(email, password);
    return res.status(200).json({ status: "success", token: token });
  } catch (error) {
    return next(error);
  }
};

exports.signUpUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.warn("Validation error in signUpUser controller: ", errors.array());
    error.statusCode = 400;
    error.data = errors.array();
    return next(error);
  }

  const userDTO = req.body;
  const userServiceInstance = new UserService();

  try {
    const { token } = await userServiceInstance.SignUp(userDTO);
    return res.status(201).json({ status: "success", token: token });
  } catch (error) {
    return next(error);
  }
};

exports.authenticateUser = async (req, res, next) => {
  try {
    const userServiceInstance = new UserService();
    const usuario = await userServiceInstance.userIsAuthenticated(req.user.id);
    return res.status(200).json({ status: "success", usuario });
  } catch (error) {
    return next(error);
  }
};