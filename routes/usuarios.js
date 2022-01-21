// ruta para crear usuario
const express = require("express");
const { check } = require("express-validator");
const router = express.Router();
const usuarioControler = require('../controllers/usuarioControllers');

//crear usuario
//api/usuario
router.post('/',
    [
        check('nombre', 'El nombre es obligatorio').notEmpty(),
        check('email', 'Agrega un email válido').isEmail(),
        check('password', 'La contraseña debe tener minimo 6 caracteres').isLength({min:6})
    ],
    usuarioControler.crearUsuario
);

module.exports = router;