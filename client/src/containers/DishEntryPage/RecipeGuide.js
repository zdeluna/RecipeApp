import React, { useState, useEffect } from "react";
import { Button, Col, Row } from "reactstrap";
import Carousel from "../../components/Carousel";
import { Link } from "react-router-dom";
import { GET_DISH } from "../../api/queries/dish/getDish";
import { GET_INGREDIENTS_IN_STEPS } from "../../api/queries/dish/getIngredientsInSteps";
import { useQuery } from "@apollo/react-hooks";

const RecipeGuide = props => {
    const [steps, setSteps] = useState(props.match.params.steps || []);
    const [ingredients, setIngredients] = useState(
        props.match.params.ingredients || []
    );
    const [ingredientsInSteps, setIngredientsInSteps] = useState([
        {
            step: 0,
            ingredients: []
        }
    ]);

    const [dishId, setDishId] = useState(props.match.params.dishId);
    const [dishUrl, setDishUrl] = useState(
        window.location.pathname.replace("/makeMode", "")
    );

    const dishQuery = useQuery(GET_DISH, {
        variables: {
            id: dishId
        }
    });

    const ingredientsQuery = useQuery(GET_INGREDIENTS_IN_STEPS, {
        variables: {
            steps: steps,
            ingredients: ingredients
        }
    });

    useEffect(() => {
        if (dishQuery.data.dish.steps.length) {
            setSteps(dishQuery.data.dish.steps);
            setIngredients(dishQuery.data.dish.ingredients);
        }

        if (ingredientsQuery.data.ingredientsInSteps.length) {
            setIngredientsInSteps(ingredientsQuery.data.ingredientsInSteps);
        }
    });

    return (
        <div>
            <Row>
                <Col>
                    <Link to={dishUrl}>
                        <Button color="warning">Exit</Button>
                    </Link>
                </Col>
            </Row>

            <Carousel
                dishId={dishId}
                steps={steps}
                ingredientsInSteps={ingredientsInSteps}
            />
        </div>
    );
};

export default RecipeGuide;
