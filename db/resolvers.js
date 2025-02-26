const usuario = require('../models/usuario');
const Producto =require('../models/Producto');
const Cliente =require('../models/Cliente');
const Pedido =require('../models/Pedido');
const bcryptjs = require('bcryptjs');
const jwt=require('jsonwebtoken');
require('dotenv').config({path:'variables.env'});
//resolver
const resolvers = {
    Query: {
        obtenerUsuario:async(_,{token})=>{
            const usuarioId=await jwt.verify(token,process.env.SECRETA);
            return usuarioId;
        },
        obtenerProductos:async ()=>{
            try {
                const productos = await Producto.find({});
                return productos;    
            } catch (error) {
                console.log(error);
            }
            
        },
        obtnerProductoId: async(_,{id})=>{
                const prod= await Producto.findById(id);
                console.log(prod);
                if (!prod) {
                    throw new Error('producto no encontrado')
                }
                return prod;
        },
        obtenerClientes: async()=>{
            try {
                const clientes = await Cliente.find({});
                return clientes;
            } catch (error) {
                console.log(error);
            }
        },
        obtenerClienteByVendedor:async(_,{},ctx)=>{
            try {
                const clientes = await Cliente.find({vendedor:ctx.usuario.id.toString()});
                return clientes;
            } catch (error) {
                console.log(error);
            }
        },
        obtenerClienteId:async (_,{id},ctx)=>{
            //Revisar si el cliente existe o no
            const clie = await Cliente.findById(id);
            if (!clie) {
                throw new Error('El cliente no existe');
            }
            //Quien lo creo puede vero
            if (clie.vendedor.toString() != ctx.usuario.id) {
                throw new Error ('No tienes las credenciales');
            }
            return clie;
        },
        obtenerPedidos:async()=>{
            try {
                const pedidos=await Pedido.find({});
                return pedidos;
            } catch (error) {
                console.log(error)
            }        
        },
        obtenerPedidosByUsuario:async(_,{},ctx)=>{
            try {
                const pedidos=await Pedido.find({vendedor:ctx.usuario.id});
                return pedidos;
            } catch (error) {
                console.log(error);
            }
        },
        obtenerPedidoById:async(_,{id},ctx)=>{
            const pedido=await Pedido.findById(id);
            if (!pedido) {
                throw new Error("No se encuentra el pedido");
            }
            if (pedido.vendedor.toString() !== ctx.usuario.id) {
                throw new Error ('No tienes las credenciales');
            }
            return pedido;
        },
        obtenerPedidoByState:async(_,{state},ctx)=>{
            try {
                const pedidos= await Pedido.find({estado:state});
                return pedidos;
            } catch (error) {
                console.log(error);
            }
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
        },
        nuevoProducto: async(_,{input})=>{
            try{
                const producto=new Producto(input);
                //almacenar en la bd
                const resultado = await producto.save();
                return resultado;
            }catch (error){
                console.log(error);
            }
        },
        actualizarProducto:async(_,{id,input})=>{
            //Revisar si existe el producto
            let prod= await Producto.findById(id);
                console.log(prod);
                if (!prod) {
                    throw new Error('producto no encontrado')
                }
            //Guardamos en la base de datos
            prod=await Producto.findOneAndUpdate({_id:id},input,{new:true});
            return prod;
        },
        eliminarProducto: async(_,{id})=>{
            //Revisar si existe el producto
            let prod= await Producto.findById(id);
                console.log(prod);
                if (!prod) {
                    throw new Error('producto no encontrado')
                }
            await Producto.findOneAndDelete({_id:id});
            return "Producto eliminado";
        },
        nuevoCliente: async(_,{input},ctx)=>{
            //verificar si el cliente ya está registrado
            const {email}= input;
            const cliente = await Cliente.findOne({email});
            if (cliente) {
                throw new Error('Ya existe el cliente');
            }
            const nuevoCliente = new Cliente(input);
            nuevoCliente.vendedor=ctx.usuario.id;
            //almacenar en la bd
            try {
                
                const resultado=await nuevoCliente.save();
                return resultado;
            } catch (error) {
                console.log(error);
            }   
        },
        actualizarCliente:async(_,{id,input},ctx)=>{
            //Revisar si existe el cliente
            let clie= await Cliente.findById(id);
                if (!clie) {
                    throw new Error('Cliente no encontrado')
                }
            //verificar si usuario puede editar ese cliente
            if (clie.vendedor.toString() != ctx.usuario.id) {
                throw new Error ('No tienes las credenciales');
            }
            //Guardamos en la base de datos
            clie=await Cliente.findOneAndUpdate({_id:id},input,{new:true});
            return clie;            
        },
        eliminarCliente:async(_,{id},ctx)=>{
            //existe cliente
            let clie= await Cliente.findById(id);
                if (!clie) {
                    throw new Error('Cliente no encontrado')
                }
            //verificar si usuario puede eliminar cliente
            if (clie.vendedor.toString() != ctx.usuario.id) {
                throw new Error ('No tienes las credenciales');
            }
            await Cliente.findOneAndDelete({_id:id});
            return "Cliente eliminado";
        },
        nuevoPedido:async(_,{input},ctx)=>{
            const {cliente}=input;
            //si el cliente existe o no
            const clie=await Cliente.findById(cliente);
            if (!clie) {
                throw new Error("No existe el cliente");
            }
            //verificar si el cliente es del vendedor
            if (clie.vendedor.toString()!== ctx.usuario.id) {
                throw new Error('No tienes las credenciales');
            }
            //revisar si el stock esta disponible
            for await (const articulo of input.pedido){
                const {id}=articulo;
                const producto = await Producto.findById(id);
                if (articulo.cantidad>producto.existencia) {
                    throw new Error(`El artículo: ${producto.nombre} excede la cantidad disponible`);
                } else{
                    //restar el stock de producto
                    producto.existencia=producto.existencia-articulo.cantidad;
                    await producto.save()
                }           
            };
            //crear un nuevo pedido
            const nuevoPedido =new Pedido(input);
            //asignarle un vendedor
            nuevoPedido.vendedor=ctx.usuario.id;
            //guardarp
            const resultado=await nuevoPedido.save();
            return resultado;
        },
        actualizarPedido:async (_,{id,input},ctx)=>{
            const {cliente}=input;
            //Revisar si el pedido existe
            const pedido = await Pedido.findById(id);
            if (!pedido) {
                throw new Error("El pedido no se encuentra");
            }
            //existe cliente
            const existeCliente= await Cliente.findById(cliente);
            if (!existeCliente) {
                throw new Error("El cliente no existe");
            }

            //si el cliente y pedido pertenece al vendedor
            //verificar si el vendedor es quien edita
            if (existeCliente.vendedor.toString()!== ctx.usuario.id) {
                throw new Error("No tienes credenciales");
            }    

            //Revisar stock
            //revisar si el stock esta disponible
            if (input.pedido) {
                for await (const articulo of input.pedido){
                    const {id}=articulo;
                    const producto = await Producto.findById(id);
                    if (articulo.cantidad>producto.existencia) {
                        throw new Error(`El artículo: ${producto.nombre} excede la cantidad disponible`);
                    } else{
                        //restar el stock de producto
                        producto.existencia=producto.existencia-articulo.cantidad;
                        await producto.save()
                    }           
                };    
            }            

            //actualizamos
            const resultado = await Pedido.findOneAndUpdate({_id:id},input,{new:true});
            return resultado;
        },
        eliminarPedido:async (_,{id},ctx)=>{
            //Revisar si el pedido existe
            const pedido = await Pedido.findById(id);
            if (!pedido) {
                throw new Error("El pedido no se encuentra");
            }
            if (pedido.vendedor.toString()!== ctx.usuario.id) {
                throw new Error("No tienes credenciales");
            }  
            console.log("a lo mejor esta un poco loca");
            await Pedido.findOneAndDelete({_id:id});
            return "Pedido eliminado";//
        }
}
}


const crearToken=(usuario,secreta,expiresIn)=>{
    console.log(usuario);
    const {id,email,nombre,apellido}=usuario;
    return jwt.sign({id,email,nombre,apellido},secreta,{expiresIn})
}
module.exports = resolvers;