import React, {Component} from 'react';
import {withRouter} from 'react-router';
import app from '../../base';
import {Form, Button, Input, FormGroup, Label} from 'reactstrap';

class LogIn extends Component {
    handleLogIn = async event => {
        event.preventDefault();
        const {email, password} = event.target.elements;
        try {
            await app
                .auth()
                .signInWithEmailAndPassword(email.value, password.value);
            this.props.history.push('/');
        } catch (error) {
            alert(error);
        }
    };

    render() {
        return (
            <div>
                <h1>Log in</h1>
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
                    <Button color="primary" onClick={this.hanldeLogIn}>
                        Log in
                    </Button>
                </Form>
            </div>
        );
    }
}

export default withRouter(LogIn);
