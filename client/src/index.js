import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import registerServiceWorker from "./registerServiceWorker";
import "bootstrap/dist/css/bootstrap.min.css";

import { AuthProvider } from "./AuthProvider";
import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { persistCache, LocalStorageWrapper } from "apollo3-cache-persist";
import { createHttpLink } from "apollo-link-http";
import { setContext } from "apollo-link-context";
import { onError } from "apollo-link-error";
import { ApolloProvider } from "@apollo/react-hooks";
import { from } from "apollo-boost";
import { ApolloLink } from "apollo-link";
import { REFRESH_TOKEN } from "./api/mutations/user/refreshToken";
import { createBrowserHistory } from "history";
import { Provider } from "react-redux";
import store from "./store";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";

const init = async () => {
    const history = createBrowserHistory();
    let persistor = persistStore(store);

    let GRAPHQL_URI = "https://graphql.recipescheduler.net/graphql";
    if (process.env.NODE_ENV === "development") {
        GRAPHQL_URI = "http://localhost:4000";
    }

    const httpLink = createHttpLink({
        uri: GRAPHQL_URI,
        credentials: "include"
    });

    const errorLink = onError(({ graphQLErrors, networkError }) => {
        if (graphQLErrors)
            graphQLErrors.map(({ message, locations, path }) => {
                // If the user is not authenticated, remove the token in local storage which will proceed the user to the login screen
                if (message === "401: Unauthorized") {
                    localStorage.removeItem("jwt_token");
                    localStorage.removeItem("jwt_token_expiry");
                    localStorage.removeItem("userId");
                    client.cache.reset();
                }
                console.log(
                    `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
                );
            });

        if (networkError) console.log(`[Network error]: ${networkError}`);
    });

    const refreshJWT = async () => {
        const result = await client.mutate({
            variables: { accessToken: localStorage.getItem("jwt_token") },
            mutation: REFRESH_TOKEN
        });

        // Store the new token and token expiration date
        if (result.data.refreshToken) {
            localStorage.setItem(
                "jwt_token",
                result.data.refreshToken.jwt_token
            );
            localStorage.setItem(
                "jwt_token_expiry",
                result.data.refreshToken.jwt_token_expiry
            );
        }
    };

    const authLink = setContext(async (_, { headers }) => {
        // Check to make sure the jwt isn't expired
        const expirationDate = localStorage.getItem("jwt_token_expiry");
        // If the jwt is expired, fetch a new token
        if (
            expirationDate &&
            _.operationName != "refreshToken" &&
            _.operationName != "signInUser" &&
            _.operationName != "addUser"
        ) {
            // If the jwt token is expired
            if (new Date() > new Date(expirationDate)) {
                await refreshJWT();
            }
        }
        const token = localStorage.getItem("jwt_token");

        return {
            headers: {
                ...headers,
                authorization: token ? `Bearer ${token}` : ""
            }
        };
    });

    //const cache = new InMemoryCache({ dataIdFromObject: object => object.id });
    const cache = new InMemoryCache();

    await persistCache({
        cache,
        storage: new LocalStorageWrapper(window.localStorage)
    });

    const client = new ApolloClient({
        cache,
        fetchOptions: {
            origin: "https://www.recipescheduler.net",
            credentials: "include"
        },
        link: from([authLink, errorLink, httpLink])
    });

    ReactDOM.render(
        <ApolloProvider client={client}>
            <Provider store={store}>
                <PersistGate loading={null} persistor={persistor}>
                    <AuthProvider history={history}>
                        <App history={history} />
                    </AuthProvider>
                </PersistGate>
            </Provider>
        </ApolloProvider>,
        document.getElementById("root")
    );
    registerServiceWorker();
};
init();
