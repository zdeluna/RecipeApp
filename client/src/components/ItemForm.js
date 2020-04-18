//@format

import React, { useState, useEffect, useRef } from "react";
import Item from "./Item";
import { Form, Button, FormGroup, Container, Col, Row } from "reactstrap";
import "./ItemForm.css";
import { useQuery, useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { UPDATE_DISH } from "../api/mutations/dish/updateDish";

const GET_DISH = gql`
    query getDish($userId: String!, $dishId: String!) {
        dish(userId: $userId, dishId: $dishId) {
            __typename
            id
            steps {
                value
            }
            ingredients {
                value
            }
        }
    }
`;

const ItemForm = props => {
    const [userId] = useState(props.userId);
    const [type] = useState(props.type);
    const [update] = useState(props.update);

    let dishid = update ? props.match.params.dishId : props.dishId;
    const [dishId] = useState(dishid);

    let dishCategory = update ? props.match.params.category : props.category;
    const [category] = useState(dishCategory);

    const [itemsArray, setItemsArray] = useState([
        { value: "", visible: false }
    ]);

    useQuery(GET_DISH, {
        variables: {
            dishId: dishId
        },
        onCompleted({ dish }) {
            if (update) {
                if (type === "steps" && dish.steps && dish.steps.length)
                    setItemsArray(dish.steps);
                if (
                    type === "ingredients" &&
                    dish.ingredients &&
                    dish.ingredients.length
                )
                    setItemsArray(dish.ingredients);
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

    const [updateDish] = useMutation(UPDATE_DISH, {
        onCompleted(updateDishResponse) {
            props.history.push(`/users/category/${category}/dish/${dishId}`);
        }
    });

    const addItemsToDatabase = () => {
        console.log("USER: " + userId);
        // Only store the value fields from itemsArray.
        let itemsData = itemsArray.map(function(item) {
            return {
                value: item.value
            };
        });

        if (update) {
            updateDish({
                variables: {
                    dishId: dishId,
                    [type]: itemsData
                }
            });
        } else props.onClick(itemsData);
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
        console.log("Submit form");
        event.preventDefault();
        addItemsToDatabase();
    };

    const handleDeleteItem = index => {
        console.log("delete: " + index);
        let newItemsArray = removeItem(index);
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
                                Add
                            </Button>
                            <Button color="primary">Save</Button>
                        </FormGroup>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};
export default ItemForm;
