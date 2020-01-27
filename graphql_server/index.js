const {ApolloServer, gql} = require('apollo-server-cloud-functions');
const typeDefs = require('./schema/schema.js');
const resolvers = require('./resolvers');

const DishAPI = require('./datasources/Dish');

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
