import React, { useContext, useState } from "react";
import { useMutation } from "@apollo/react-hooks";

import { Link } from "react-router-dom";
import { Container, Form, Button, Input, FormGroup, Label } from "reactstrap";
import { ADD_USER } from "../../api/mutations/user/createUser";
import { LOG_IN_USER } from "../../api/mutations/user/signInUser";
import { useApolloClient } from "@apollo/react-hooks";
import AlertBanner from "../../components/AlertBanner";
import { AuthContext } from "../../AuthProvider";

const SignUp = props => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const client = useApolloClient();

    const [showAlert, setShowAlert] = useState("");
    const { signUp } = useContext(AuthContext);
    const handleSignUp = async event => {
        try {
            event.preventDefault();
            client.cache.reset();
            const response = await signUp(email, password);
        } catch (error) {
            //console.log(error);
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
                    <Button
                        color="primary"
                        type="submit"
                        onClick={handleSignUp}
                    >
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
