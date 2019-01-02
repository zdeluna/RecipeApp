import React from 'react';
import {Form, Button, Input, FormGroup, Label} from 'reactstrap';

const LogInView = ({onSubmit}) => {
    return (
        <div>
            <h1>Log in</h1>
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
                <Button color="primary">Log in</Button>
            </Form>
        </div>
    );
};

export default LogInView;
