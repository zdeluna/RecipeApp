import React, { useState } from "react";
import { Link } from "react-router-dom";
import app from "../../base";
import { Container, Form, Button, Input, FormGroup, Label } from "reactstrap";
import { useApolloClient } from "@apollo/react-hooks";

const LogIn = props => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const client = useApolloClient();
    const handleLogIn = async event => {
        event.preventDefault();
        try {
            const result = await app
                .auth()
                .signInWithEmailAndPassword(email, password);

            /* Get the JWT token of the user */
            app.auth().onAuthStateChanged(function(user) {
                if (user) {
                    /* Clear the cache of a previously logged in user */
                    client.resetStore();

                    user.getIdToken().then(function(idToken) {
                        localStorage.setItem("token", idToken);
                    });
                }
            });

            props.history.push("/users/category");
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
                <h1>Log in</h1>
                <Form>
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
                    <Button color="primary" onClick={handleLogIn}>
                        Log in
                    </Button>
                    <p>
                        <Link to={`/signup`}>Don't have an account</Link>
                    </p>
                </Form>
            </Container>
        </div>
    );
};

export default LogIn;
