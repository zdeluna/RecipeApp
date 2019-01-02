import React from 'react';
import {Form, Button, Input, FormGroup, Label} from 'reactstrap';

const SignUpView = ({onSubmit}) => {
    return (
        <div>
            <h1>Sign up</h1>
            <Form onSubmit={onSubmit}>
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
                <Button color="primary">Sign Up</Button>
            </Form>
        </div>
    );
};

export default SignUpView;
