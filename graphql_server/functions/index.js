("use strict");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname + "/.env") });

const typeDefs = require("./schema/schema.js");
const resolvers = require("./resolvers");

const DishAPI = require("./datasources/Dish");
const UserAPI = require("./datasources/User");
const { AuthenticationError } = require("apollo-server");
const httpHeadersPlugin = require("apollo-server-plugin-http-headers");
const { https } = require("firebase-functions");

const dataSources = () => ({
    dishAPI: new DishAPI(),
    userAPI: new UserAPI()
});

const context = async ({ req, res }) => {
    const auth = (req.headers && req.headers.authorization) || "";
    //if (!auth) throw new AuthenticationError("you must be logged in");
    //
    const cookie = req.headers.cookie || "";

    return {
        setCookies: new Array(),
        setHeaders: new Array(),
        token: auth,
        cookie: cookie
    };
};

if (process.env.GRAPH_ENV == "test") {
    const { ApolloServer } = require("apollo-server");
    const server = new ApolloServer({
        cors: {
            origin: "http://localhost:3000",
            credentials: true
        },
        playground: {
            settings: {
                "request.credentials": "include"
            }
        },
        typeDefs,
        resolvers,
        dataSources: dataSources,
        plugins: [httpHeadersPlugin],
        context: context
    });
    server.listen().then(({ url }) => {
        console.log(`GraphQL Development Server ready at ${url}`);
    });
} else {
    const express = require("express");
    const firebase = require("firebase-admin");

    const { ApolloServer } = require("apollo-server-express");

    const app = express();
    const server = new ApolloServer({
        cors: {
            origin: "https://www.recipescheduler.net",
            credentials: true,
            allowedHeaders:
                "Origin, X-Requested-With, Content-Type, Accept, Authorization"
        },
        playground: {
            settings: {
                "request.credentials": "include"
            }
        },
        typeDefs,
        resolvers,
        dataSources: dataSources,
        plugins: [httpHeadersPlugin],
        context: context
    });

    server.applyMiddleware({ app, path: "/", cors: true });

    exports.graphql = https.onRequest(app);
}
