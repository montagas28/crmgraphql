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
    type Mutation {
        #usuarios   
        nuevoUsuario (input: UsuarioInput): Usuario
        autenticarUsuairo(input: AutenticarInput):Token

        #productos
        nuevoProducto (input: ProductoInput):Producto
        actualizarProducto(id:ID!,input: ProductoInput):Producto
        eliminarProducto(id:ID!):String
    }
`;

module.exports=typeDefs;