const {ApolloServer} = require('apollo-server');
const typeDefs = require('./schema/schema2.js');
const resolvers = require('./resolvers');

const dishAPI = require('./datasources/Dish');

const server = new ApolloServer({
    typeDefs,
    resolvers,
    dataSources: () => ({
        dishAPI: new DishAPI(),
    }),
});

server.listen().then(({url}) => {
    console.log(`Server ready at ${url}`);
});
