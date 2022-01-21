const bcryptjs = require("bcryptjs");
const { validationResult } = require("express-validator");
const Usuarios = require("../models/Usuarios");
const jwt = require('jsonwebtoken');

exports.crearUsuario= async (req, res) =>{

    //revisa si hay errores
    const errores = validationResult(req);
    if(!errores.isEmpty()){
        return res.status(400).json({errores: errores.array()})
    }

    const { email, password } = req.body;

    try {
        let usuario = await Usuarios.findOne({email});

        // verificar existencia de correo
        if(usuario){
            return res.status(400).send({msg:'El usuario ya existe'})
        }

        //crea el nuevo usuario
        usuario = new Usuarios(req.body);

        //hashear password
        const salt = await bcryptjs.genSalt(10);
        usuario.password = await bcryptjs.hash(password, salt);

        //guarda el usuario
        await usuario.save();

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
        res.status(400).send('Hubo un error');
    };
};