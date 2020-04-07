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
                        /*localStorage.setItem(
                            "token",
                            "eyJhbGciOiJSUzI1NiIsImtpZCI6IjgzYTczOGUyMWI5MWNlMjRmNDM0ODBmZTZmZWU0MjU4Yzg0ZGI0YzUiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vcmVjaXBlYXBwLTRiZDhkIiwiYXVkIjoicmVjaXBlYXBwLTRiZDhkIiwiYXV0aF90aW1lIjoxNTg2MDM0MTA2LCJ1c2VyX2lkIjoiMmRHQXB3ZVlTR1g4RWpUNWtDU2VMM25ndGtlMiIsInN1YiI6IjJkR0Fwd2VZU0dYOEVqVDVrQ1NlTDNuZ3RrZTIiLCJpYXQiOjE1ODYwMzQxMDYsImV4cCI6MTU4NjAzNzcwNiwiZW1haWwiOiJ6ZGVsdW5hMkBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZW1haWwiOlsiemRlbHVuYTJAZ21haWwuY29tIl19LCJzaWduX2luX3Byb3ZpZGVyIjoicGFzc3dvcmQifX0.cKEs2kq699Xbw4kzqPhXOhfpPlEaa5LGE_VYy7jL5qCrbSX7Gz_HjSSYmgcqFawoDaOYBFHIP28mwszkL7BXS8jaJNjZ2Dt1Vr0R7FU7OqeH-Z5ysErkpESBUj43BX2ab0julJdKZO6CETs9pHm95NncwSoR25NrdMK0l_avmcUnnpCd4f5XfvsrsjSJ5R08qsA5WuUlMAQriJpx-HCcLRw1T0iT7RKL1Xk1oHorVtuavfDtKyhvAP80C6VGwwrYc90oxlQNIK0GNvqM-V_qktoqd6Ke5L7BjSdGdxkI4pkp5xYN-dGyGNxAmZ2EXPRH68TVmHoNuKkRzew0gWufYg"
                        );*/
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
