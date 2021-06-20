import React, { useState } from "react";
import { Form, Button, FormGroup, Label, Input, Container } from "reactstrap";
import "./AddDishForm.css";
import { useMutation } from "@apollo/react-hooks";
import { ADD_DISH } from "../api/mutations/dish/createDish";
import { GET_DISHES } from "../api/queries/dish/getAllDishes";
import { useApolloClient } from "@apollo/react-hooks";
import { useSelector, useDispatch } from "react-redux";
import { addNewDish2 } from "../features/dishes/dishesSlice.js";

const AddDishForm = props => {
    const [input, setInputValue] = useState("");
    const client = useApolloClient();

    const dispatch = useDispatch();
    const { entities } = useSelector(state => state.dishes);
    const dishes = entities;

    const [addDish] = useMutation(ADD_DISH, {
        onCompleted({ addDish }) {
            console.log("add dish mutation");
            console.log(input);
            dispatch({
                type: "dishes/dishAdded",
                payload: {
                    id: addDish.id,
                    category: props.category,
                    name: input
                }
            });
            /*
            let data = client.readQuery({
                query: GET_DISHES
            });

            data.dishes.push({
                id: addDish.id,
                category: props.category,
                name: input.value
            });

            client.writeQuery({
                query: GET_DISHES,
                data: { dishes: data.dishes }
            });*/

            props.onClick(addDish.id);
        }
    });

    return (
        <Container>
            <Form
                inline
                onSubmit={e => {
                    e.preventDefault();
                    addDish({
                        variables: {
                            name: input,
                            category: props.category
                        }
                    });
                }}
            >
                <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                    <Label for="newDishInput">New Dish Name: </Label>
                    <Input
                        type="text"
                        id="newDishInput"
                        onChange={e => {
                            setInputValue(e.target.value);
                        }}
                    />
                </FormGroup>
                <Button color="primary">Submit</Button>
            </Form>
        </Container>
    );
};

export default AddDishForm;
