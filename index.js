const {ApolloServer}=require('apollo-server');
const typeDefs = require('./db/schema');
const resolvers =require('./db/resolvers');


// servidor
const server = new ApolloServer({
    typeDefs,
    resolvers,
    context:()=>{
        const miContext = 'Bayron Miguel Trejo Rosero';
        return {miContext};
    }
});

//arrancar el servidor
server.listen().then(({url})=>{
    console.log('Servidor listo en la url ${url}')
})