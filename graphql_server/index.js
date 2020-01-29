const typeDefs = require('./schema/schema.js');
const resolvers = require('./resolvers');

const DishAPI = require('./datasources/Dish');
console.log('IN INDEX: ' + process.env.GRAPH_ENV);
if (process.env.GRAPH_ENV == 'test') {
    const {ApolloServer} = require('apollo-server');
    const server = new ApolloServer({
        typeDefs,
        resolvers,
        dataSources: () => ({
            dishAPI: new DishAPI(),
        }),
    });

    server.listen().then(({url}) => {
        console.log(`GraphQL Server ready at ${url}`);
    });
} else {
    const {ApolloServer} = require('apollo-server-cloud-functions');
    const server = new ApolloServer({
        typeDefs,
        resolvers,
        dataSources: () => ({
            dishAPI: new DishAPI(),
        }),
        playground: true,
        introspection: true,
        context: ({req, res}) => ({
            headers: req.headers,
            req,
            res,
        }),
    });

    exports.handler = server.createHandler({
        cors: {
            origin: '*',
            credentials: true,
        },
    });
}
