const Mongoose = require("mongoose");


const TareaSchema = Mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    estado: {
        type: Boolean,
        default: false
    },
    creado: {
        type: Date,
        default: Date.now()
    },
    proyecto: {
        type: Mongoose.Schema.Types.ObjectId,
        ref: 'Proyecto'
    }
});

module.exports = Mongoose.model('Tarea', TareaSchema);