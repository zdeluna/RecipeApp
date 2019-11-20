import React, {Component} from 'react';
import app from '../base';
import {Form, Button, FormGroup, Label, Input, Container} from 'reactstrap';
import './AddDishForm.css';
import API from '../utils/Api';
import gql from 'graphql-tag';
import {useMutation} from '@apollo/react-hooks';
import {Query} from 'react-apollo';

const ADD_DISH = gql`
    mutation addDish($userId: String!, $name: String!, $category: String!) {
        addDish(userId: $userId, name: $name, category: $category)
    }
`;

function AddDishForm(props) {
    let input = {value: ''};
    const [addDish, {data}] = useMutation(ADD_DISH);

    return (
        <Container>
            <Form
                inline
                onSubmit={e => {
                    e.preventDefault();
                    addDish({
                        variables: {
                            userId: props.uid,
                            name: input.value,
                            category: props.category,
                        },
                    });
                    if (data) {
                        console.log('DATA: ' + data.addDish.id);
                    }

                    input.value = '';
                    if (data && data.addDish) {
                        props.onClick(data.addDish.id);
                    }
                }}>
                <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                    <Label for="newDishInput">New Dish Name: </Label>
                    <Input
                        type="text"
                        id="newDishInput"
                        onChange={e => {
                            input.value = e.target.value;
                        }}
                    />
                </FormGroup>
                <Button color="primary">Submit</Button>
            </Form>
        </Container>
    );
}

export default AddDishForm;
