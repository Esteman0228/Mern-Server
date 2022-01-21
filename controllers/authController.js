const bcryptjs = require("bcryptjs");
const { validationResult } = require("express-validator");
const Usuarios = require("../models/Usuarios");
const jwt = require('jsonwebtoken');

exports.autenticarUsuario = async (req, res) => {
    //revisa si hay errores
    const errores = validationResult(req);
    if(!errores.isEmpty()){
        return res.status(400).json({errores: errores.array()})
    }

    //estraer email y password
    const { email, password } = req.body;

    try {
        //revisar usuario registrado
        let usuario = await Usuarios.findOne({email});
        if(!usuario){
            return res.status(400).json({msg:"El usuario no existe"})
        }

        //revisar contraseña registrado
        const passwordCorrecto = await bcryptjs.compare(password, usuario.password);
        if(!passwordCorrecto){
            return res.status(400).json({msg: "password incorrecto"})
        }

        //crear y firmar el jwt
        const payload = {
        usuario:{
            id: usuario.id
        }
        };

        //firmar el jwt
        jwt.sign(payload, process.env.SECRETA, {
            expiresIn:3600 //1 hora
        }, (error, token)=>{
            if(error) throw error;
            //mensaje de confirmación
            res.send({token});
            
        });

    } catch (error) {
        console.log(error);
    }

}

//obtuebe que usuario está autenticado
exports.usuarioAutenticado = async (req, res) => {
    try {
        const usuario = await Usuarios.findById(req.usuario.id).select('-password'); 
        res.json({usuario})
    } catch (error) {
        console.log(error);
        res.status(500).json({msg:'Hubo un error'})
    }
}