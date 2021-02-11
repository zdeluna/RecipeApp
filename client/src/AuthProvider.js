import React, { useState } from "react";
import { useMutation, useLazyQuery } from "@apollo/react-hooks";
import { LOG_IN_USER } from "./api/mutations/user/signInUser";
import { ADD_USER } from "./api/mutations/user/createUser";
import { GET_USER } from "./api/queries/user/getUser";
import { useApolloClient } from "@apollo/react-hooks";

export const AuthContext = React.createContext({});

export const AuthProvider = ({ children }) => {
    const client = useApolloClient();
    let userData = null;

    try {
        const { user } = client.readQuery({
            query: GET_USER,
            variables: { id: 1 }
        });
        console.log("No error");
        userData = user;
    } catch (error) {
        console.log(error);
    }

    const [getUser, { called, loading, data }] = useLazyQuery(GET_USER, {
        async onCompleted({ user }) {
            userData = user;
            console.log(user);
            console.log(user.id);
        }
    });

    const [signInUser] = useMutation(LOG_IN_USER, {
        errorPolicy: "all",
        async onCompleted({ signInUser }) {
            localStorage.setItem("token", signInUser.token);
            getUser({ variables: { id: signInUser.id } });
        }
    });

    const [addUser] = useMutation(ADD_USER, {
        async onCompleted({ addUser }) {
            localStorage.setItem("token", addUser.token);

            getUser({ variables: { id: addUser.id } });
        }
    });

    return (
        <AuthContext.Provider
            value={{
                user: userData,
                login: async (username, password) => {
                    await signInUser({
                        variables: { username: username, password: password }
                    });
                },
                signUp: async (username, password) => {
                    await addUser({
                        variables: {
                            username: username,
                            password: password
                        }
                    });
                }
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
