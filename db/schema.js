const {gql}=require('apollo-server')
//schema
const typeDefs = gql`

    type Usuario {
        id:ID
        nombre:String
        apellido:String
        email:String
        creado:String
    }
    input UsuarioInput{
        nombre:String!
        apellido:String!
        email:String!
        password:String!
    }

    type Token {
        token: String
    }

    input AutenticarInput{
        email:String!
        password:String!
    }
    type Query {
        #Usuarios
        obtenerUsuario(token:String!):Usuario
        #Productos
        obtenerProductos:[Producto]
        obtnerProductoId(id:ID!):Producto
        #clientes
        obtenerClientes:[Cliente]
        obtenerClienteByVendedor:[Cliente]
        obtenerClienteId(id:ID!):Cliente
    },
    type Producto{
        id:ID
        nombre:String
        existencia:Int
        precio:Float
        creado:String
    }
    input ProductoInput{
        nombre:String!
        existencia:Int!
        precio:Float!
    }  
    type Cliente{
        id:ID
        nombre:String
        apellido:String
        empresa:String
        email:String
        telefono:String
        vendedor:ID
    }    
    input ClienteInput{
        nombre:String!
        apellido:String!
        empresa:String!
        email:String!
        telefono:String
    }    
    type Mutation {
        #usuarios   
        nuevoUsuario (input: UsuarioInput): Usuario
        autenticarUsuairo(input: AutenticarInput):Token

        #productos
        nuevoProducto (input: ProductoInput):Producto
        actualizarProducto(id:ID!,input: ProductoInput):Producto
        eliminarProducto(id:ID!):String

        #clientes
        nuevoCliente(input:ClienteInput):Cliente
        actualizarCliente(id:ID!,input:ClienteInput):Cliente
        eliminarCliente(id:ID!):String
    }
`;

module.exports=typeDefs;