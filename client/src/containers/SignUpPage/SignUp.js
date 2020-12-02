import React, { useState } from "react";
import { useMutation } from "@apollo/react-hooks";

import { Link } from "react-router-dom";
import app from "../../base";
import { Container, Form, Button, Input, FormGroup, Label } from "reactstrap";
import { ADD_USER } from "../../api/mutations/user/createUser";
import { LOG_IN_USER } from "../../api/mutations/user/signInUser";
import { useApolloClient } from "@apollo/react-hooks";

const SignUp = props => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const client = useApolloClient();

    const [signInUser] = useMutation(LOG_IN_USER, {
        errorPolicy: "all",
        async onCompleted({ signInUser }) {
            client.resetStore();

            localStorage.setItem("token", signInUser.token);
            props.history.push("/users/category");
        }
    });

    const [addUser] = useMutation(ADD_USER, {
        onCompleted({ addUser }) {
            /* Clear the cache of a previously logged in user */
            client.resetStore();
            signInUser({ variables: { username: email, password } });
        }
    });

    const handleSignUp = async event => {
        event.preventDefault();
        client.resetStore();
        try {
            addUser({
                variables: {
                    username: email,
                    password: password
                }
            });
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
            </Container>
        </div>
    );
};

export default SignUp;
