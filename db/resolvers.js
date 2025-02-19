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
        obtenerTecnologias:()=>cursos,
        getCursesByTecnology:(_,{input}, ctx, info)=>{
            const result = cursos.filter(curso=>curso.tecnologia===input.tecnologia);
            return result;
        },
    }
}

module.exports = resolvers;