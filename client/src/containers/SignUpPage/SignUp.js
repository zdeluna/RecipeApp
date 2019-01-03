import React, {Component} from 'react';
import {withRouter} from 'react-router';
import app from '../../base';
import {Form, Button, Input, FormGroup, Label} from 'reactstrap';

class SignUp extends Component {
    handleSignUp = async event => {
        event.preventDefault();
        const {email, password} = event.target.elements;
        try {
            await app
                .auth()
                .createUserWithEmailAndPassword(email.value, password.value)
                .then(function(user) {
                    var userId = user.user.uid;
                    var userData = {
                        username: email.value,
                    };

                    // Add the user to the database
                    app.database()
                        .ref('users/' + userId)
                        .set({
                            userData,
                        });
                });
            this.props.history.push('/');
        } catch (error) {
            alert(error);
        }
    };

    render() {
        return (
            <div>
                <h1>Sign up</h1>
                <Form>
                    <FormGroup>
                        <Label for="userEmail">Email</Label>
                        <Input
                            name="email"
                            type="email"
                            id="userEmail"
                            placeholder="Email"
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label for="userPassword">Password</Label>
                        <Input
                            name="password"
                            type="password"
                            id="userPassword"
                            placeholder="Password"
                        />
                    </FormGroup>
                    <Button color="primary" onClick={this.handleSignUp}>
                        Sign Up
                    </Button>
                </Form>
            </div>
        );
    }
}

export default withRouter(SignUp);
