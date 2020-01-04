import React, {useState, useEffect} from 'react';
import {Link, Redirect} from 'react-router-dom';
import DishEntryStepsTable from '../../components/DishEntryStepsTable';
import DishEntryIngredientsTable from '../../components/DishEntryIngredientsTable';
import Calendar from '../../components/Calendar';
import Loading from '../../components/Loading';
import Notes from '../../components/Notes';
import CookingTime from '../../components/CookingTime';
import NewDishForm from '../../components/NewDishForm';
import {Container, Row, Col} from 'reactstrap';
import API from '../../utils/Api';
import './DishEntry.css';
import {Button} from 'reactstrap';
import {graphql} from 'react-apollo';
import {useQuery} from '@apollo/react-hooks';
import gql from 'graphql-tag';
import {useApolloClient} from '@apollo/react-hooks';
import {GET_DISH} from '../../api/queries/dish/getDish';

const DishEntry = props => {
    const [userId, setUserId] = useState(props.userId);
    const [dishId, setDishId] = useState(props.match.params.dishId);
    const [name, setName] = useState('');
    const [url, setUrl] = useState('');
    const [category, setCategory] = useState(props.match.params.category);
    const [steps, setSteps] = useState([]);
    const [ingredients, setIngredients] = useState([]);
    const [history, setHistory] = useState([]);
    const [makeDishMode, setMakeDishMode] = useState(false);
    const [deleteDishMode, setDeleteDishMode] = useState(false);

    const client = useApolloClient();

    const {loading, error, dishData} = useQuery(GET_DISH, {
        variables: {
            userId: userId,
            dishId: dishId,
        },
        onCompleted({dish}) {
            console.log(dish);
            if (dish.steps && dish.steps.length) {
                setSteps(dish.steps);
            }
            if (dish.ingredients && dish.ingredients.length)
                setIngredients(dish.ingredients);
            if (dish.history) setHistory(dish.history);
            if (dish.url) setUrl(dish.url);
            if (dish.name) setName(dish.name);
        },
    });

    const makeDishModeButton = event => {
        setMakeDishMode(true);
    };

    const handleStepsAndIngredientsSubmitted = dish => {
        //Handle after user has submitted steps
        const dishData = client.readQuery({
            query: GET_DISH,
            variables: {userId: userId, dishId: dishId},
        });
        if (dishData.dish.steps && dishData.dish.steps.length) {
            setSteps(dishData.dish.steps);
        }
        if (dishData.dish.ingredients && dishData.dish.ingredients.length) {
            setIngredients(dishData.dish.ingredients);
        }
    };

    const deleteEntryFromDatabase = () => {
        var api = new API();
        api.deleteDish(userId, dishId).then(response => {
            if (response.status === 204) {
                setDeleteDishMode(true);
            }
        });
    };

    const RenderNewDishForm = props => {
        /*
        if (deleteDishMode) {
            let redirect_url = '/users/category/' + category;

            return <Redirect push to={redirect_url} />;
        }

        if (makeDishMode) {
            let redirect_url =
                '/users/category/' +
                category +
                '/dish/' +
                dishId +
                '/' +
                'makeMode';

            return (
                <Redirect
                    to={{
                        pathname: redirect_url,
                        state: {
                            steps: '1',
                            ingredients: '1',
                            ingredientsInSteps: '1',
                        },
                    }}
                />
            );
        }
                    */
        if (steps.length < 1 || ingredients.length < 1) {
            return (
                <NewDishForm
                    dishId={dishId}
                    userId={userId}
                    category={category}
                    onClick={handleStepsAndIngredientsSubmitted}
                    steps={steps}
                    ingredients={ingredients}
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
                                category={category}
                                userID={userId}
                            />
                            <hr />
                            <CookingTime
                                dishId={dishId}
                                category={category}
                                userID={userId}
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
            <div id="dishEntryContainer">
                <Row>
                    <Col>
                        {' '}
                        <Link
                            to={`/users/category/${category}`}
                            id="goBackLink">
                            Go Back
                        </Link>
                    </Col>
                    <Col sm="2" md={{size: 2, offset: 3}}>
                        <Button
                            id="makeDishModeButton"
                            color="success"
                            size="sm"
                            onClick={makeDishModeButton}>
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
                    <Col sm="2" md={{size: 2, offset: 0}}>
                        <Button
                            id="deleteDishButton"
                            color="danger"
                            size="sm"
                            onClick={deleteEntryFromDatabase}>
                            Delete Entry
                        </Button>
                    </Col>
                </Row>
            </div>
        );
};
export default DishEntry;
