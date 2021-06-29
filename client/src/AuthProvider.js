import React, { useState, useEffect } from "react";
import { useMutation, useQuery, useLazyQuery } from "@apollo/react-hooks";
import { LOG_IN_USER } from "./api/mutations/user/signInUser";
import { ADD_USER } from "./api/mutations/user/createUser";
import { GET_USER } from "./api/queries/user/getUser";
import { UPDATE_USER } from "./api/mutations/user/updateUser";
import { useApolloClient } from "@apollo/react-hooks";
import { useDispatch } from "react-redux";

export const AuthContext = React.createContext({});

export const AuthProvider = ({ children, history }) => {
    const client = useApolloClient();
    const [userData, setUserData] = useState({});
    const [updateUser] = useMutation(UPDATE_USER);
    const dispatch = useDispatch();

    const [getUser] = useLazyQuery(GET_USER, {
        async onCompleted({ user }) {
            console.log("call dispatch");
            dispatch({ type: "users/userLoaded", payload: user });
            setUserData({ ...user, isAuthenticated: true });
            let watcher = client.cache.watch({
                query: GET_USER,
                variables: { id: user.id },

                callback: data => {
                    console.log("DATA");
                    console.log(data);
                    if (data.result.user == null) {
                        setUserData({ isAuthenticated: false });
                    } else {
                        setUserData({ ...userData, isAuthenticated: true });
                    }
                }
            });
            history.replace("/users/category");
        }
    });
    useEffect(() => {
        try {
            const { user } = client.readQuery({
                query: GET_USER,
                variables: { id: localStorage.getItem("userId") }
            });
            setUserData({ ...user, isAuthenticated: true });
        } catch (error) {}
    }, []);

    const [username, setUserName] = useState("");
    const [password, setPassword] = useState("");

    const [signInUser] = useMutation(LOG_IN_USER, {
        errorPolicy: "all",
        async onCompleted({ signInUser }) {
            localStorage.setItem("userId", signInUser.id);
            localStorage.setItem("jwt_token", signInUser.jwt_token);
            localStorage.setItem(
                "jwt_token_expiry",
                signInUser.jwt_token_expiry
            );
            await getUser({ variables: { id: signInUser.id } });
        }
    });

    const [addUser] = useMutation(ADD_USER, {
        async onCompleted({ addUser }) {
            await signInUser({
                variables: {
                    username: username,
                    password: password
                }
            });
        }
    });

    return (
        <AuthContext.Provider
            value={{
                user: userData,
                login: async (username, password) => {
                    client.cache.reset();

                    await signInUser({
                        variables: {
                            username: username,
                            password: password
                        }
                    });
                },
                signUp: async (username, password) => {
                    console.log("Sign up");
                    client.cache.reset();
                    setUserName(username);
                    setPassword(password);
                    await addUser({
                        variables: {
                            username: username,
                            password: password
                        }
                    });
                },
                update: async updatedProperties => {
                    await updateUser(updatedProperties);
                },
                updateUser: async updatedUser => {
                    setUserData(updatedUser);
                },
                logout: () => {
                    console.log("logout");
                    localStorage.removeItem("userId");
                    localStorage.removeItem("jwt_token");
                    localStorage.removeItem("jwt_token_expiry");
                    client.cache.reset();
                    setUserData({ isAuthenticated: false });
                    dispatch({ type: "LOGOUT" });
                }
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
