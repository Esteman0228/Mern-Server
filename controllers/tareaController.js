const Tarea = require('../models/Tarea');
const Proyecto = require('../models/Proyecto');
const { validationResult } = require('express-validator')

exports.crearTarea = async (req, res) => {

    //revisa si hay errores
    const errores = validationResult(req);
    if(!errores.isEmpty()){
        return res.status(400).json({errores: errores.array()})
    }
    //verifica si el proyecto existe
    try {

        //extrae el proyecto
        const {proyecto} = req.body;

        // revisa si el proyecto existe
        const proyectoExistente = await Proyecto.findById(proyecto);
        if(!proyectoExistente){
            return res.status(404).json({msg: 'Proyecto no encontrado'});
        }

        //verificar si el proyecto actual pertenece a un usuario autenticado
        if(proyectoExistente.creador.toString() !== req.usuario.id){
            return res.status(401).json({msg: 'No autorizado'});
        }

        //crear tarea
        const tarea = new Tarea(req.body);
        await tarea.save();
        res.json({tarea});

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }

}


//obtiene las tareas por proyectos
exports.obtenerTareas = async (req, res) => {
    try {
        //extrae el proyecto
        const {proyecto} = req.query;

        // revisa si el proyecto existe
        const proyectoExistente = await Proyecto.findById(proyecto);
        if(!proyectoExistente){
            return res.status(404).json({msg: 'Proyecto no encontrado'});
        }

        //obtener tareas por proyectos
        const tareas = await Tarea.find({ proyecto });
        res.json({tareas})

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

//Actualizar la tarea por id
exports.actualizarTarea = async (req, res) =>{
    try {
        //extrae el proyecto
        const {proyecto, nombre, estado} = req.body;

        // revisa si la tarea existe
        let tareaExistente = await Tarea.findById(req.params.id);
        if(!tareaExistente){
            return res.status(404).json({msg: 'Tarea no encontrada'});
        }

        //extrae proyecto
        const proyectoExistente = await Proyecto.findById(proyecto);

        //verificar si el proyecto actual pertenece a un usuario autenticado
        if(proyectoExistente.creador.toString() !== req.usuario.id){
            return res.status(401).json({msg: 'No autorizado'});
        }

        //crea un objeto con la nueva informacion 
        const nuevaTarea = {};
        nuevaTarea.nombre = nombre
        nuevaTarea.estado = estado

        //guardar la tarea
        tareaExistente = await Tarea.findOneAndUpdate({_id: req.params.id}, nuevaTarea, {new: true});
        
        res.json({tareaExistente})

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

//eliminar una tarea
exports.eliminarTarea = async (req, res) =>{
    try {
        //extrae el proyecto
        const {proyecto} = req.query;

        // revisa si la tarea existe
        let tareaExistente = await Tarea.findById(req.params.id);
        if(!tareaExistente){
            return res.status(404).json({msg: 'Tarea no encontrada'});
        }

        //extrae proyecto
        const proyectoExistente = await Proyecto.findById(proyecto);

        //verificar si el proyecto actual pertenece a un usuario autenticado
        if(proyectoExistente.creador.toString() !== req.usuario.id){
            return res.status(401).json({msg: 'No autorizado'});
        }

        //eliminar
        await Tarea.findOneAndRemove({_id: req.params.id})
        
        res.json({msg: 'Tarea eliminada'})

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}