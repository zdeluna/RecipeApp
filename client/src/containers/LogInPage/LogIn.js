import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import app from "../../base";
import { Container, Form, Button, Input, FormGroup, Label } from "reactstrap";
import { useApolloClient } from "@apollo/react-hooks";
import { useMutation, useQuery } from "@apollo/react-hooks";
import { LOG_IN_USER } from "../../api/mutations/user/signInUser";
import AlertBanner from "../../components/AlertBanner";
import { AuthContext } from "../../AuthProvider";

const LogIn = props => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const client = useApolloClient();

    const [showAlert, setShowAlert] = useState("");
    const { login } = useContext(AuthContext);

    const handleLogIn = async event => {
        try {
            const response = await login(email, password);
            props.history.push("/users/category");
        } catch (error) {
            switch (error.message) {
                case "GraphQL error: Password is not valid.":
                    alert("Password is not valid.");
                    break;
                case "GraphQL error: No user was found.":
                    alert("No user was not found.");
                    break;
                default:
                    setShowAlert("Username or password is incorrect.");
                    break;
            }
        }

        event.preventDefault();
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
                <ShowAlert />
            </Container>
        </div>
    );
};

export default LogIn;
