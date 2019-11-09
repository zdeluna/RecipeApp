import React, {Component} from 'react';
import app from '../base';
import {Form, Button, FormGroup, Label, Input, Container} from 'reactstrap';
import './AddDishForm.css';
import API from '../utils/Api';
import {ApolloClient} from 'apollo-boost';
import {ApolloProvider} from 'react-apollo';
import {gql} from 'apollo-boost';
import {graphql} from 'react-apollo';
import {useMutation} from '@apollo/react-hooks';
import {Query} from 'react-apollo';

const ADD_DISH = gql`
    mutation addDish($name: String!, $category: String!, $uid: ID!) {
        addDish(name: $name, category: $category, uid: $uid) {
            id
        }
    }
`;

function AddDishForm(props) {
    let input = {value: ''};
    const [addDish, {data}] = useMutation(ADD_DISH, {
        onCompleted({addDish}) {
            console.log('DATAIN' + data);
        },
    });

    return (
        <Container>
            <Form
                inline
                onSubmit={e => {
                    e.preventDefault();
                    addDish({
                        variables: {
                            name: input.value,
                            category: props.category,
                            uid: props.uid,
                        },
                    });
                    input.value = '';
                    console.log(data);
                    // props.onClick(data.id);
                    //var keys = Object.keys(data);
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
