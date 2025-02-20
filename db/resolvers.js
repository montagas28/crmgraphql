const usuario = require('../models/usuario');
const bcryptjs = require('bcryptjs');
const jwt=require('jsonwebtoken');
require('dotenv').config({path:'variables.env'});
//resolver
const resolvers = {
    Query: {
        obtenerUsuario:async(_,{token})=>{
            const usuarioId=await jwt.verify(token,process.env.SECRETA);
            return usuarioId;
        }
    },
    Mutation: {
        nuevoUsuario: async(_,{input})=>{
            const {email, password}=input;
            //validaciones
            const existeUsuario = await usuario.findOne({email});
            if(existeUsuario){
                throw new Error('El usuario ya esta registrado');

            }
            //hashear pass
            const salt = await bcryptjs.genSalt(10);
            input.password = await bcryptjs.hash(password,salt);

            //Guardar en la base de datos
            try{
                const obj = new usuario(input); 
                obj.save();
                return obj;
            }catch (error){
                console.log(error)
            }
        },
        autenticarUsuairo: async(_,{input})=>{
            //Nos recibimos el email y el pass en un objeto desde input. (este input vendra según schema )
            const {email,password}=input;
            //Buscamos si existe ese email con funcion findOne
            const existeUsuario = await usuario.findOne({email});
            //Si no existe lanzamos el error
            if(!existeUsuario){
                throw new Error('El usuario no existe');
            }
            //usuario existe prosigue
            //Revisar si el pass es correcto. Nos ayudamos del método compare de bcryptjs (por que esta encriptado) para mandar como primer parámetro lo que estamos ingresando como pass.
            //El segundo parámetro es el que nos devuelve la mutación en el obj existeUsuaio
            const passwordCorrecto=await bcryptjs.compare(password, existeUsuario.password);
            //No coincide el pass lanza un error
            if(!passwordCorrecto){
                throw new Error('El password es incorrecto')
            }    
            //Si todo correcto se crea el token con ayuda del método crearToken
            return {
                token:crearToken(existeUsuario,process.env.SECRETA,'24h')
            }
        }
}
}


const crearToken=(usuario,secreta,expiresIn)=>{
    console.log(usuario);
    const {id,email,nombre,apellido}=usuario;
    return jwt.sign({id,email,nombre,apellido},secreta,{expiresIn})
}
module.exports = resolvers;