const  Proyecto = require('../models/Proyecto');
const {validationResult} = require('express-validator');

exports.crearProyecto = async (req, res) =>{

    //revisa si hay errores
    const errores = validationResult(req);
    if(!errores.isEmpty()){
        return res.status(400).json({errores: errores.array()})
    }

    try {
        //crea el nuevo proyecto
        const proyecto = new Proyecto(req.body);

        //guarda el creador via JWT
        proyecto.creador = req.usuario.id;

        //guarda el proyecto
        proyecto.save();
        res.json(proyecto);

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error ');
    }
}

//Obtiene todos los proyectos del usuario actual
exports.obtenerProyectos = async (req, res) => {
    try {
        const proyectos = await Proyecto.find({ creador: req.usuario.id });
        res.json({proyectos});
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

//Actualizar proyecto existente
exports.actualizarProyecto =  async (req, res) => {
        //revisa si hay errores
        const errores = validationResult(req);
        if(!errores.isEmpty()){
            return res.status(400).json({errores: errores.array()})
        }

        //extrae la info del proyecto
        const { nombre } = req.body;
        const nuevoNombre = {};

        if(nombre){
            nuevoNombre.nombre = nombre;
        }

        try {
            //revisar el id
            let proyecto = await Proyecto.findById(req.params.id);
            //si el proyecto existe o no
            if(!proyecto){
                return res.status(404).json({msg:'Proyecto no encontrado'})
            }
            //verificar el creador del proyecto
            if(proyecto.creador.toString() !== req.usuario.id){
                return res.status(401).json({msg: 'No autorizado'});
            }
            //actualizar
            proyecto = await Proyecto.findByIdAndUpdate({_id: req.params.id}, {$set: nuevoNombre}, {new: true});

            res.json({proyecto});

        } catch (error) {
            console.log(error);
            res.status(500).send('Error en el servidor');
        }
}

//Eliminar proyecto por su id
exports.eliminarProyecto = async (req, res) => {
    try {
        //revisar el id
        let proyecto = await Proyecto.findById(req.params.id);

        //si el proyecto existe o no
        if(!proyecto){
            return res.status(404).json({msg: 'Proyecto no encontrado'});
        }

        //verificar el creador del proyecto
        if(proyecto.creador.toString() !== req.usuario.id){
            return res.status(401).json({msg: 'Usuario no autorizado'});
        }
        
        //eliminar proyecto
        proyecto = await Proyecto.findOneAndRemove({_id: req.params.id})

        //respuesta
        res.json({msg: 'Proyecto eliminado'})

    } catch (error) {
        console.log(error);
        res.status(500).send('Error en el servidor')
    }
}