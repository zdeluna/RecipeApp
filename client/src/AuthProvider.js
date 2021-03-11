import React, { useState } from "react";
import { useMutation, useQuery, useLazyQuery } from "@apollo/react-hooks";
import { LOG_IN_USER } from "./api/mutations/user/signInUser";
import { ADD_USER } from "./api/mutations/user/createUser";
import { GET_USER } from "./api/queries/user/getUser";
import { UPDATE_USER } from "./api/mutations/user/updateUser";
import { useApolloClient } from "@apollo/react-hooks";

export const AuthContext = React.createContext({});

export const AuthProvider = ({ children }) => {
    const client = useApolloClient();
    const [userData, setUserData] = useState("");

    const [updateUser] = useMutation(UPDATE_USER);
    try {
        useQuery(GET_USER, {
            variables: { id: localStorage.getItem("userId") },
            async onCompleted({ user }) {
                setUserData(user);
            }
        });
    } catch (error) {
        console.log(error);
    }

    const [getUser] = useLazyQuery(GET_USER, {
        async onCompleted({ user }) {
            setUserData(user);
        }
    });

    const [signInUser] = useMutation(LOG_IN_USER, {
        errorPolicy: "all",
        async onCompleted({ signInUser }) {
            localStorage.setItem("userId", signInUser.id);
            localStorage.setItem("token", signInUser.token);
            getUser({ variables: { id: signInUser.id } });
        }
    });

    const [addUser] = useMutation(ADD_USER, {
        async onCompleted({ addUser }) {
            localStorage.setItem("token", addUser.token);
            localStorage.setItem("userId", addUser.id);

            getUser({
                variables: { id: localStorage.getItem("userId") }
            });
        }
    });

    return (
        <AuthContext.Provider
            value={{
                user: userData,
                login: async (username, password) => {
                    client.resetStore();
                    await signInUser({
                        variables: {
                            username: username,
                            password: password
                        }
                    });
                },
                signUp: async (username, password) => {
                    client.resetStore();
                    await addUser({
                        variables: {
                            username: username,
                            password: password
                        }
                    });
                },
                update: async updatedProperties => {
                    await updateUser(updatedProperties);
                }
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
