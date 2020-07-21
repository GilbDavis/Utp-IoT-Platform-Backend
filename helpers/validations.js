const { check } = require('express-validator');
const { User } = require('../models');

const validation = {
  User: {
    register: [
      check("name").trim().not().isEmpty().isString().withMessage("El nombre es obligatorio"),
      check("lastName").trim().not().isEmpty().isString().withMessage("El apellido es obligatorio"),
      check("email").trim().isEmail().withMessage("Ingrese un email valido.")
        .custom((value, { req }) => {
          return User.findOne({ where: { email: value } })
            .then(userDoc => {
              if (userDoc) {
                return Promise.reject("Este correo electronico ya fue utilizado.");
              }
            })
        }).normalizeEmail({ gmail_remove_dots: false, gmail_lowercase: true }),
      check("password").trim().notEmpty().withMessage("Ingrese una contraseña").isLength({ min: 8 }).withMessage("Minimo 8 caracteres.")
    ]
  }
};

module.exports = validation;