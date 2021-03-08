import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DishEntryStepsTable from "../../components/DishEntryStepsTable";
import DishEntryIngredientsTable from "../../components/DishEntryIngredientsTable";
import Calendar from "../../components/Calendar";
import Loading from "../../components/Loading";
import Notes from "../../components/Notes";
import CookingTime from "../../components/CookingTime";
import NewDishForm from "../../components/NewDishForm";
import { Container, Row, Col } from "reactstrap";
import "./DishEntry.css";
import { Button } from "reactstrap";
import { useApolloClient } from "@apollo/react-hooks";
import { GET_DISH } from "../../api/queries/dish/getDish";
import { DELETE_DISH } from "../../api/mutations/dish/deleteDish";
import { useMutation, useQuery } from "@apollo/react-hooks";
import { GET_DISHES } from "../../api/queries/dish/getAllDishes";
import { getIngredientsInSteps } from "../../utils/utils";

const DishEntry = props => {
    const [userId] = useState(props.userId);
    const [dishId] = useState(props.match.params.dishId);
    const [name, setName] = useState("");
    const [url, setUrl] = useState("");
    const [cookingTime, setCookingTime] = useState("");
    const [notes, setNotes] = useState("");
    const [category] = useState(props.match.params.category);
    const [steps, setSteps] = useState([]);
    const [ingredients, setIngredients] = useState([]);
    const [history, setHistory] = useState([]);
    const [makeDishMode, setMakeDishMode] = useState(false);
    const [dish, setDish] = useState({});
    const client = useApolloClient();
    const [steps2, setSteps2] = useState([]);

    const [deleteDish] = useMutation(DELETE_DISH, {
        onCompleted(updateDishResponse) {
            /*
            const { dishes } = client.readQuery({ query: GET_DISHES });
            // Remove the recently deleted dish from the apollo cache.
            client.writeQuery({
                query: GET_DISHES,
                data: { dishes: dishes.filter(e => e.id != id) }
            });*/

            props.history.push(`/users/category/${category}`);
        }
    });

    const { loading } = useQuery(GET_DISH, {
        variables: {
            id: dishId
        },
        async onCompleted({ dish }) {
            if (dish.steps && dish.steps.length) {
                setSteps(dish.steps);
            }
            if (dish.ingredients && dish.ingredients.length)
                setIngredients(dish.ingredients);
            if (dish.history) setHistory(dish.history);
            if (dish.url) setUrl(dish.url);
            if (dish.name) setName(dish.name);
            if (dish.cookingTime) setCookingTime(dish.cookingTime);
            if (dish.notes) setNotes(dish.notes);
            setDish(dish);
        }
    });

    const makeDishModeButton = event => {
        setMakeDishMode(true);
    };

    const handleStepsAndIngredientsSubmitted = dish => {
        //Handle after user has submitted steps

        const dishData = client.readQuery({
            query: GET_DISH,
            variables: { userId: userId, id: dishId }
        });
        if (dishData.dish.steps && dishData.dish.steps.length) {
            setSteps(dishData.dish.steps);
        }
        if (dishData.dish.ingredients && dishData.dish.ingredients.length) {
            setIngredients(dishData.dish.ingredients);
        }
    };

    const deleteEntryFromDatabase = () => {
        deleteDish({ variables: { id: dishId } });
    };

    const RenderNewDishForm = () => {
        if (makeDishMode) {
            let redirect_url =
                "/users/category/" +
                category +
                "/dish/" +
                dishId +
                "/" +
                "makeMode";

            props.history.push(redirect_url, {
                steps: steps,
                ingredients: ingredients
            });
        }

        if (steps.length < 1 || ingredients.length < 1) {
            return (
                <NewDishForm
                    dishId={dishId}
                    userId={userId}
                    category={category}
                    onClick={handleStepsAndIngredientsSubmitted}
                    steps={steps}
                    ingredients={ingredients}
                    dish={dish}
                />
            );
        } else {
            return (
                <Container>
                    <Row>
                        <Col xs="8">
                            <DishEntryIngredientsTable
                                type="Ingredients"
                                entries={ingredients}
                                dishId={dishId}
                                category={category}
                            />
                        </Col>
                        <Col xs="4">
                            <Calendar
                                dishId={dishId}
                                category={category}
                                userId={userId}
                                history={history}
                            />
                            <hr />
                            <Notes
                                dishId={dishId}
                                userId={userId}
                                notes={notes}
                            />
                            <hr />
                            <CookingTime
                                dishId={dishId}
                                userId={userId}
                                cookingTime={cookingTime}
                            />
                        </Col>
                    </Row>
                    <Row>
                        <DishEntryStepsTable
                            type="Directions"
                            entries={steps}
                            dishId={dishId}
                            category={category}
                        />
                    </Row>
                </Container>
            );
        }
    };
    if (loading) return <Loading />;
    else
        return (
            <div>
                <Row>
                    <Col>
                        {" "}
                        <Link
                            to={`/users/category/${category}`}
                            id="goBackLink"
                        >
                            Go Back
                        </Link>
                    </Col>
                    <Col sm="2" md={{ size: 2, offset: 3 }}>
                        <Button
                            id="makeDishModeButton"
                            color="success"
                            size="sm"
                            onClick={makeDishModeButton}
                        >
                            Make Dish Mode
                        </Button>
                    </Col>
                </Row>

                <Row>
                    <Col className="text-center">
                        <h1>{name}</h1>
                        <a href={url}>
                            <h5>{url}</h5>
                        </a>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <RenderNewDishForm />
                    </Col>
                </Row>
                <Row>
                    <Col sm="2" md={{ size: 2, offset: 0 }}>
                        <Button
                            id="deleteDishButton"
                            color="danger"
                            size="sm"
                            onClick={deleteEntryFromDatabase}
                        >
                            Delete Entry
                        </Button>
                    </Col>
                </Row>
            </div>
        );
};
export default DishEntry;
