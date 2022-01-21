// ruta para autenticar usuarios
const express = require("express");
const { check } = require("express-validator");
const router = express.Router();
const authControllers = require('../controllers/authController');
const auth = require("../middleware/auth");

//crear usuario
//api/auth
router.post('/',
    authControllers.autenticarUsuario
);

//obtiene el usuario autenticado
//api/auth
router.get('/',
    auth,    
    authControllers.usuarioAutenticado
);

module.exports = router;