//@format

import React, { useState, useEffect, useRef } from "react";
import Item from "./Item";
import { Form, Button, FormGroup, Container, Col, Row } from "reactstrap";
import "./ItemForm.css";
import { useQuery, useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { UPDATE_PARTIAL_DISH } from "../api/mutations/dish/updateDish";
import { useApolloClient } from "@apollo/react-hooks";
import { GET_DISH } from "../api/queries/dish/getDish";

const ItemForm = props => {
    const [userId] = useState(props.userId);
    const [type] = useState(props.type);
    const [update] = useState(props.update);

    let dishid = update ? props.match.params.dishId : props.dishId;
    const [dishId] = useState(dishid);

    let dishCategory = update ? props.match.params.category : props.category;
    const [category] = useState(dishCategory);
    const [dish, setDish] = useState({});
    const client = useApolloClient();
    const [itemsArray, setItemsArray] = useState([
        { value: "", visible: false }
    ]);

    const buttonText = type.substring(0, type.length - 1);

    useQuery(GET_DISH, {
        variables: {
            id: dishId
        },
        onCompleted({ dish }) {
            if (update) {
                if (type === "steps" && dish.steps && dish.steps.length) {
                    var stepsArray = dish.steps.map(step => ({
                        value: step,
                        visible: "true"
                    }));
                    setItemsArray(stepsArray);
                }
                if (
                    type === "ingredients" &&
                    dish.ingredients &&
                    dish.ingredients.length
                ) {
                    var ingredientsArray = dish.ingredients.map(ingredient => ({
                        value: ingredient,
                        visible: "true"
                    }));

                    setItemsArray(ingredientsArray);
                }
            }
        }
    });

    const ref = useRef(false);
    useEffect(() => {
        ref.current = true;
        return () => {
            ref.current = false;
        };
    }, []);

    const [updatePartialDish] = useMutation(UPDATE_PARTIAL_DISH, {
        onCompleted(updateDishResponse) {
            props.history.push(`/users/category/${category}/dish/${dishId}`);
        }
    });

    const addItemsToDatabase = () => {
        if (update) {
            // Filter the array to only have the value property
            let filteredArray = itemsArray.map(item => item.value);
            console.log("filtered Array");
            console.log(filteredArray);
            updatePartialDish({
                variables: {
                    id: dishId,
                    [type]: filteredArray
                }
            });

            let data = client.readQuery({
                query: GET_DISH,
                variables: { id: dishId }
            });

            data.dish[type] = filteredArray;

            client.writeQuery({
                query: GET_DISH,
                variables: { id: dishId },
                data: { dish: data.dish }
            });
        } else props.onClick(itemsArray);
    };

    const addItem = event => {
        // Concatenate an array with stepForms that includes the new step
        let newItemsArray = itemsArray.concat({
            value: "",
            visible: true
        });
        setItemsArray(newItemsArray);
    };

    const handleChange = (index, value) => {
        let newItemsArray = itemsArray;
        newItemsArray[index].value = value;
        setItemsArray(newItemsArray);
    };

    const handleSubmit = event => {
        event.preventDefault();
        addItemsToDatabase();
    };

    const handleDeleteItem = index => {
        let newItemsArray = removeItem(index);
        console.log("After deletion");
        console.log(newItemsArray);

        setItemsArray(newItemsArray);
    };

    const removeItem = index => {
        return itemsArray.filter((_, i) => i !== index);
    };

    return (
        <Container>
            <Row>
                <Col lg={{ size: 8, offset: 2 }}>
                    <Form onSubmit={handleSubmit}>
                        {itemsArray.map((item, index) => (
                            <FormGroup key={"ItemFormGroup" + index}>
                                <Item
                                    key={new Date().getTime() + index}
                                    id={index}
                                    value={item.value}
                                    onChange={handleChange}
                                    onClick={index => handleDeleteItem(index)}
                                    onBlur={handleChange}
                                    deleteButton={item.visible}
                                    type={type}
                                />
                            </FormGroup>
                        ))}
                        <FormGroup>
                            <Button
                                className="formButtons"
                                color="primary"
                                onClick={addItem}
                            >
                                Add {buttonText}
                            </Button>
                            <Button color="primary">Done</Button>
                        </FormGroup>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};
export default ItemForm;
