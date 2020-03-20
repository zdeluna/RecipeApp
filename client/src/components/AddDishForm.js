import React, {useState} from 'react';
import {Form, Button, FormGroup, Label, Input, Container} from 'reactstrap';
import './AddDishForm.css';
import {useMutation} from '@apollo/react-hooks';
import {ADD_DISH} from '../api/mutations/dish/createDish';

const AddDishForm = props => {
    let input = {value: ''};
    const [addDish] = useMutation(ADD_DISH, {
        onCompleted({addDish}) {
            props.onClick(addDish.dishId);
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
                            userId: props.userId,
                            name: input.value,
                            category: props.category,
                        },
                    });

                    input.value = '';
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
};

export default AddDishForm;
