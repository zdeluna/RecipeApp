import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import registerServiceWorker from "./registerServiceWorker";
import "bootstrap/dist/css/bootstrap.min.css";

import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { createHttpLink } from "apollo-link-http";
import { setContext } from "apollo-link-context";
import { onError } from "apollo-link-error";
import { ApolloProvider } from "@apollo/react-hooks";
import { from } from "apollo-boost";
import app from "./base";

let GRAPHQL_URI =
    "https://us-central1-recipescheduler-227221.cloudfunctions.net/handler";
if (process.env.NODE_ENV === "development") {
    GRAPHQL_URI = "http://localhost:4000";
}

const httpLink = createHttpLink({
    uri: GRAPHQL_URI,
    headers: {
        "client-name": "Recipe Scheduler [web]",
        "client-version": "1.0.0"
    }
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors)
        graphQLErrors.map(({ message, locations, path }) => {
            // If the user is not authenticated, remove the token in local storage which will proceed the user to the login screen
            if (message === "401: Unauthorized") {
                localStorage.setItem("token", null);
                client.cache.reset();
                app.auth().signOut();
            }
            console.log(
                `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
            );
        });

    if (networkError) console.log(`[Network error]: ${networkError}`);
});

const authLink = setContext((_, { headers }) => {
    // get the authentication token from local storage if it exists
    const token = localStorage.getItem("token");
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : ""
        }
    };
});

const cache = new InMemoryCache({ dataIdFromObject: object => object.id });
const client = new ApolloClient({
    cache,
    link: from([authLink, errorLink, httpLink])
});

ReactDOM.render(
    <ApolloProvider client={client}>
        <App />
    </ApolloProvider>,
    document.getElementById("root")
);
registerServiceWorker();
