'use strict';
const typeDefs = require('./schema/schema.js');
const resolvers = require('./resolvers');

const DishAPI = require('./datasources/Dish');
const UserAPI = require('./datasources/User');
if (process.env.GRAPH_ENV == 'test') {
    const {ApolloServer} = require('apollo-server');
    const server = new ApolloServer({
        typeDefs,
        resolvers,
        dataSources: () => ({
            dishAPI: new DishAPI(),
            userAPI: new UserAPI(),
        }),
    });

    server.listen().then(({url}) => {
        console.log(`GraphQL Development Server ready at ${url}`);
    });
} else {
    const {ApolloServer} = require('apollo-server-cloud-functions');
    const server = new ApolloServer({
        typeDefs,
        resolvers,
        dataSources: () => ({
            dishAPI: new DishAPI(),
            userAPI: new UserAPI(),
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
