import React, { useState } from "react";
import AddUrlForm from "../components/AddUrlForm";
import ItemForm from "../components/ItemForm";
import { Button, Row, Col, Container } from "reactstrap";
import "./NewDishForm.css";
import { UPDATE_DISH } from "../api/mutations/dish/updateDish";
import { useMutation, useQuery } from "@apollo/react-hooks";
import { GET_DISH } from "../api/queries/dish/getDish";
import { useApolloClient } from "@apollo/react-hooks";

const NewDishForm = props => {
    const [userId] = useState(props.userId);
    const [dishId] = useState(props.dishId);
    const [progressNumber, setProgressNumber] = useState(0);
    const [dish, setDish] = useState(props.dish);
    const client = useApolloClient();

    /*  Progress Number
        1: User wants to get steps/ingredients from url
        2: User is setting steps
        3: User is setting ingredients
    */
    /*
    useQuery(GET_DISH, {
        variables: {
            dishId: dishId
        },
        onCompleted({ dish }) {
            setDish(dish);
        }
    });*/

    const [updateDish] = useMutation(UPDATE_DISH, {
        onCompleted(updateDishResponse) {
            props.onClick();
        }
    });

    const addSteps = steps => {
        let filteredSteps = steps.map(step => step.value);
        let filteredIngredients = dish.ingredients.map(
            ingredient => ingredient.value
        );

        setDish({ ...dish, steps: filteredSteps });
        updateDish({
            variables: {
                id: dish.id,
                ingredients: filteredIngredients,
                steps: filteredSteps,
                name: dish.name,
                category: dish.category
            }
        });

        let data = client.readQuery({
            query: GET_DISH,
            variables: { id: dish.id }
        });

        data.dish.steps = filteredSteps;
        data.dish.ingredients = filteredIngredients;

        client.writeQuery({
            query: GET_DISH,
            variables: { id: dish.id },
            data: { dish: data.dish }
        });
    };

    const addIngredients = ingredients => {
        setDish({ ...dish, ingredients: ingredients });

        setProgressNumber(3);
    };

    const handleClick = (event, progressNumber) => {
        setProgressNumber(progressNumber);
    };

    const RenderForm = () => {
        if (progressNumber === 0 || progressNumber === 4) return null;
        else if (progressNumber === 1) {
            return (
                <AddUrlForm
                    dishId={dishId}
                    category={props.category}
                    onClick={props.onClick}
                />
            );
        } else if (progressNumber === 2) {
            return (
                <ItemForm
                    key={dishId + "ingredients"}
                    dishId={dishId}
                    onClick={addIngredients}
                    type={"ingredients"}
                />
            );
        } else if (progressNumber === 3) {
            return (
                <ItemForm
                    key={dishId + "steps"}
                    dishId={dishId}
                    onClick={addSteps}
                    type={"steps"}
                />
            );
        }
    };

    return (
        <div>
            <Container>
                <Row>
                    <Col sm="12" md={{ size: 6, offset: 3 }}>
                        <h3>{props.name}</h3>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Button
                            className="newFormButtons"
                            color="primary"
                            size="lg"
                            value="0"
                            onClick={e => handleClick(e, 1)}
                        >
                            Add Url of Recipe
                        </Button>
                    </Col>
                    <Col>
                        <Button
                            className="newFormButtons"
                            color="primary"
                            size="lg"
                            value="1"
                            onClick={e => handleClick(e, 2)}
                        >
                            Add Recipe Manually
                        </Button>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <RenderForm />
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default NewDishForm;
