import React, { useState } from "react";
import { useMutation, useLazyQuery } from "@apollo/react-hooks";
import { LOG_IN_USER } from "./api/mutations/user/signInUser";
import { ADD_USER } from "./api/mutations/user/createUser";
import { GET_USER } from "./api/queries/user/getUser";
import { useApolloClient } from "@apollo/react-hooks";

export const AuthContext = React.createContext({});

export const AuthProvider = ({ children }) => {
    const client = useApolloClient();
    const [user, setUser] = useState(null);

    const [getUser, { called, loading, data }] = useLazyQuery(GET_USER);

    const [signInUser] = useMutation(LOG_IN_USER, {
        errorPolicy: "all",
        async onCompleted({ signInUser }) {
            client.resetStore();

            localStorage.setItem("token", signInUser.token);
        }
    });

    const [addUser] = useMutation(ADD_USER, {
        async onCompleted({ addUser }) {
            localStorage.setItem("token", addUser.token);

            let response = await getUser({ variables: { id: addUser.id } });
            console.log(response);
            setUser(response);
        }
    });

    return (
        <AuthContext.Provider
            value={{
                user,
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
