import React, { useState } from "react";
import { useMutation } from "@apollo/react-hooks";

import { Link } from "react-router-dom";
import app from "../../base";
import { Container, Form, Button, Input, FormGroup, Label } from "reactstrap";
import { ADD_USER } from "../../api/mutations/user/createUser";
import { LOG_IN_USER } from "../../api/mutations/user/signInUser";
import { useApolloClient } from "@apollo/react-hooks";
import AlertBanner from "../../components/AlertBanner";

const SignUp = props => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const client = useApolloClient();

    const [showAlert, setShowAlert] = useState("");
    const [signInUser] = useMutation(LOG_IN_USER, {
        errorPolicy: "all",
        async onCompleted({ signInUser }) {
            console.log(signInUser);
            localStorage.setItem("token", signInUser.token);
            props.history.push("/users/category");
        }
    });

    const [addUser] = useMutation(ADD_USER, {
        async onCompleted({ addUser }) {
            /* Clear the cache of a previously logged in user */
            //client.resetStore();
            //await signInUser({ variables: { username: email, password } });
        },
        async onError(error) {
            switch (error.message) {
                case "GraphQL error: Password is not valid.":
                    alert("Password is not valid.");
                    break;
                case "GraphQL error: No user was found.":
                    alert("No user was not found.");
                    break;
                default:
                    setShowAlert("User already exists.");
                    break;
            }
        }
    });

    const handleSignUp = async event => {
        event.preventDefault();
        client.resetStore();
        try {
            await addUser({
                variables: {
                    username: email,
                    password: password
                }
            });
            await signInUser({ variables: { username: email, password } });
        } catch (error) {
            alert(error);
        }
    };
    const handleEmailChange = event => {
        event.preventDefault();

        setEmail(event.target.value);
    };

    const handlePasswordChange = event => {
        event.preventDefault();

        setPassword(event.target.value);
    };

    const ShowAlert = () => {
        if (showAlert) return <AlertBanner message={showAlert} />;
        else return null;
    };

    return (
        <div>
            <Container>
                <h1>Sign up</h1>
                <Form onSubmit={handleSignUp}>
                    <FormGroup>
                        <Label for="userEmail">Email</Label>
                        <Input
                            name="email"
                            type="email"
                            id="userEmail"
                            placeholder="Email"
                            onChange={handleEmailChange}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label for="userPassword">Password</Label>
                        <Input
                            name="password"
                            type="password"
                            id="userPassword"
                            placeholder="Password"
                            onChange={handlePasswordChange}
                        />
                    </FormGroup>
                    <Button color="primary" type="submit">
                        Sign Up
                    </Button>
                    <p>
                        <Link to={`/login`}>Already have an account</Link>
                    </p>
                </Form>
                <ShowAlert />
            </Container>
        </div>
    );
};

export default SignUp;
