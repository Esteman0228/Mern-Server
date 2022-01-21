const Mongoose = require("mongoose");



const ProyectoSchema = Mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    creador:{
        type: Mongoose.Schema.Types.ObjectId,
        ref:'Usuarios'
    },
    creado: {
        type: Date,
        default: Date.now()
    }


});

module.exports = Mongoose.model('Proyecto', ProyectoSchema);