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
        #pedidos
        obtenerPedidos:[Pedido]
        obtenerPedidosByUsuario:[Pedido]
        obtenerPedidoById(id:ID!):Pedido
        obtenerPedidoByState(state:EstadoPedido):[Pedido]
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
    input PedidoProductoInput{
        id:ID
        cantidad:Int
    }
    input PedidoInput{
        pedido:[PedidoProductoInput]
        total:Float
        cliente:ID
        estado:EstadoPedido
    }
    enum EstadoPedido{
        PENDIENTE
        COMPLETADO
        CANCELADO
    }    
    type Pedido{
        id:ID
        pedido:[PedidoGrupo]
        total:Float
        cliente:ID
        vendedor:ID
        fecha:String
        estado:EstadoPedido
    }     
    type PedidoGrupo{
        id:ID
        cantidad:Int
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

        #Pedidos
        nuevoPedido(input:PedidoInput):Pedido
        actualizarPedido(id:ID!,input:PedidoInput):Pedido
        eliminarPedido(id:ID!):String
    }
`;

module.exports=typeDefs;