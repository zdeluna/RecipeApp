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
import withFetchDataHook from '../../utils/utils.js';
import {useApolloClient} from '@apollo/react-hooks';

const GET_DISH = gql`
    query getDish($userId: String!, $dishId: String!) {
        dish(userId: $userId, dishId: $dishId) {
            id
            name
            cookingTime
            url
            category
            steps {
                id
                value
            }
            ingredients {
                id
                value
            }
        }
    }
`;

const DishEntry = props => {
    const [userId, setUserId] = useState(props.userId);
    const [dishId, setDishId] = useState(props.match.params.dishId);
    const [category, setCategory] = useState(props.category);
    const [dish, setDish] = useState({});
    const [makeDishMode, setMakeDishMode] = useState(false);
    const [deleteDishMode, setDeleteDishMode] = useState(false);

    const client = useApolloClient();

    const {loading, error, dishData} = useQuery(GET_DISH, {
        variables: {
            userId: userId,
            dishId: dishId,
        },
        onCompleted(dishData) {
            console.log('DATA is loaded' + dishData.dish);

            setDish(dishData.dish);
        },
    });

    const makeDishModeButton = event => {
        setMakeDishMode(true);
    };

    const handleStepsAndIngredientsSubmitted = () => {
        console.log('IN FUNCTION');
        //Handle after user has submitted steps
        const dishData = client.readQuery({
            query: gql`
                query ReadDish($userId: String!, $dishId: String!) {
                    dish(userId: $userId, dishId: $dishId) {
                        id
                        category
                        cookingTime
                        name
                        url
                        steps {
                            id
                            value
                        }
                        ingredients {
                            id
                            value
                        }
                    }
                }
            `,
            variables: {userId: userId, dishId: dishId},
        });
        console.log('READ QUERY: ' + dishData);
        setDish(dishData.dish);
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

        if (!dish.steps) {
            return (
                <NewDishForm
                    dishId={dishId}
                    category={category}
                    onClick={handleStepsAndIngredientsSubmitted}
                />
            );
        } else {
            return (
                <Container>
                    <Row>
                        <Col xs="8">
                            <DishEntryIngredientsTable
                                type="Ingredients"
                                entries={dish.ingredients}
                                dishId={dishId}
                                category={category}
                            />
                        </Col>
                        <Col xs="4">
                            <Calendar
                                dishId={dishId}
                                category={category}
                                userID={userId}
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
                            entries={dish.steps}
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
                        <h1>{dish.name}</h1>
                        <a href={dish.url}>
                            <h5>{dish.url}</h5>
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
