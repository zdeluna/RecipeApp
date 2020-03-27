import React, { Component } from "react";
import { withRouter } from "react-router";
import { Link } from "react-router-dom";
import app from "../../base";
import { Container, Form, Button, Input, FormGroup, Label } from "reactstrap";

class LogIn extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: ""
        };
    }

    handleLogIn = async event => {
        event.preventDefault();
        const email = this.state.email;
        const password = this.state.password;
        const history = this.props.history;
        try {
            const result = await app
                .auth()
                .signInWithEmailAndPassword(email, password);

            /* Get the JWT token of the user */
            app.auth().onAuthStateChanged(function(user) {
                if (user) {
                    user.getIdToken().then(function(idToken) {
                        localStorage.setItem("token", idToken);
                    });
                }
            });

            history.push("/users/category");
        } catch (error) {
            alert(error);
        }
    };

    handleEmailChange = event => {
        event.preventDefault();

        this.setState({ email: event.target.value });
    };

    handlePasswordChange = event => {
        event.preventDefault();

        this.setState({ password: event.target.value });
    };

    render() {
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
                                onChange={this.handleEmailChange}
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="userPassword">Password</Label>
                            <Input
                                name="password"
                                type="password"
                                id="userPassword"
                                placeholder="Password"
                                onChange={this.handlePasswordChange}
                            />
                        </FormGroup>
                        <Button color="primary" onClick={this.handleLogIn}>
                            Log in
                        </Button>
                        <p>
                            <Link to={`/signup`}>Don't have an account</Link>
                        </p>
                    </Form>
                </Container>
            </div>
        );
    }
}

export default withRouter(LogIn);
