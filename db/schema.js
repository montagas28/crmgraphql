const {gql}=require('apollo-server')
//schema
const typeDefs = gql`
    type Curso {
        titulo: String
    }
    type Tecnologia {
        tecnologia:String
    }

    input CursoInput {
        tecnologia:String
    }

    type Query {
        obtenerCursos: [Curso]
        obtenerTecnologias: [Tecnologia]
        getCursesByTecnology(input:CursoInput!):[Curso]
    }
`;

module.exports=typeDefs;