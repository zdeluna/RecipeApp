import React, {Component} from 'react';
import {withRouter} from 'react-router';
import {Link} from 'react-router-dom';
import app from '../../base';
import {Form, Button, Input, FormGroup, Label} from 'reactstrap';
import API from '../../utils/Api';

class SignUp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
        };
    }

    handleSignUp = async event => {
        const email = this.state.email;
        const password = this.state.password;
        const history = this.props.history;
        event.preventDefault();
        try {
            await app
                .auth()
                .createUserWithEmailAndPassword(email, password)
                .then(function(user) {
                    const api = new API();
                    let userField = {email: email, uid: user.user.uid};
                    api.createUser(userField).then(response => {
                        history.push('/');
                    });
                });
        } catch (error) {
            alert(error);
        }
    };

    handleEmailChange = event => {
        event.preventDefault();

        this.setState({email: event.target.value});
    };

    handlePasswordChange = event => {
        event.preventDefault();

        this.setState({password: event.target.value});
    };

    render() {
        return (
            <div>
                <h1>Sign up</h1>
                <Form onSubmit={this.handleSignUp}>
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
                    <Button color="primary" type="submit">
                        Sign Up
                    </Button>
                    <p>
                        <Link to={`/login`}>Already have an account</Link>
                    </p>
                </Form>
            </div>
        );
    }
}

export default withRouter(SignUp);
