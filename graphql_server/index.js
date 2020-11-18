("use strict");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname + "/.env") });

const typeDefs = require("./schema/schema.js");
const resolvers = require("./resolvers");

const DishAPI = require("./datasources/Dish");
const UserAPI = require("./datasources/User");
const { AuthenticationError } = require("apollo-server");

const dataSources = () => ({
    dishAPI: new DishAPI(),
    userAPI: new UserAPI()
});

const context = async ({ req }) => {
    const auth = (req.headers && req.headers.authorization) || "";
    if (!auth) throw new AuthenticationError("you must be logged in");
    console.log("Print context token");
    console.log(auth);
    return { token: auth };
};

if (process.env.GRAPH_ENV == "test") {
    const { ApolloServer } = require("apollo-server");
    const server = new ApolloServer({
        typeDefs,
        resolvers,
        dataSources: dataSources,
        context: context
    });
    server.listen().then(({ url }) => {
        console.log(`GraphQL Development Server ready at ${url}`);
    });
} else {
    const { ApolloServer } = require("apollo-server-cloud-functions");
    const server = new ApolloServer({
        typeDefs,
        resolvers,
        dataSources: dataSources,
        playground: false,
        introspection: true,
        context: context
    });

    exports.handler = server.createHandler({
        cors: {
            origin: "*",
            credentials: true,
            allowedHeaders:
                "Origin, X-Requested-With, Content-Type, Accept, Authorization"
        }
    });
}
