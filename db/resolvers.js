const cursos =[
    {
        titulo: 'JavaScript Moderno Guía Definitiva Contruye +10 Proyectos',
        tecnologia: 'JavaScript ES6'

    },
    {
        titulo: 'React, Graphql, node',
        tecnologia: 'Graphql'
    },
]
//resolver
const resolvers = {
    Query: {
        obtenerCursos: () =>cursos,
        obtenerTecnologias:()=>cursos    
    }
}

module.exports = resolvers;