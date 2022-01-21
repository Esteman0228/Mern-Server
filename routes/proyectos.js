const express = require("express");
const router = express.Router();
const ProyectoController = require('../controllers/proyectoController');
const auth = require('../middleware/auth');
const {check} = require('express-validator');

//crear proyectos
//api/proyectos
router.post('/',
    auth,
    [
        check('nombre', 'El nombre del proyecto es obligatorio').notEmpty()
    ],  
    ProyectoController.crearProyecto
)

router.get('/',
    auth,
    ProyectoController.obtenerProyectos
)

router.put('/:id',
    auth,
    [
        check('nombre', 'El nombre del proyecto es obligatorio').notEmpty()
    ],
    ProyectoController.actualizarProyecto
)

router.delete('/:id',
    auth,
    ProyectoController.eliminarProyecto
)

module.exports = router;