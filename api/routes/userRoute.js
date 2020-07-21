const express = require("express");
const route = express.Router();
const userController = require("../controllers/userController");
const isAuth = require("../middlewares/isAuth");
const validation = require("../../helpers/validations");

// Obtiene el usuario autenticado /api/usuarios -GET
route.get("/", isAuth, userController.authenticateUser);

// Crear un usuario api/usuarios/register -POST
route.post("/register", validation.User.register, userController.signUpUser);

// Iniciar sesion api/usuarios/login -POST
route.post("/login", userController.loginUser);

module.exports = route;