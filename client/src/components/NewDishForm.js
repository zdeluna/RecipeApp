import React, {useState, useRef} from 'react';
import app from '../base';
import AddUrlForm from '../components/AddUrlForm';
import ItemForm from '../components/ItemForm';
import {Button, Row, Col, Container} from 'reactstrap';
import './NewDishForm.css';
import {UPDATE_DISH} from '../api/mutations/dish/updateDish';
import {useMutation} from '@apollo/react-hooks';
import {useApolloClient} from '@apollo/react-hooks';

const NewDishForm = props => {
    const client = useApolloClient();

    const [userId, setUserId] = useState(props.userId);
    const [dishId, setDishId] = useState(props.dishId);
    const [step, setStep] = useState(0);
    const [steps, setSteps] = useState([]);
    const [ingredients, setIngredients] = useState([]);

    const [updateDish, {data}] = useMutation(UPDATE_DISH, {
        onCompleted(updateDishResponse) {
            props.onClick();
        },
    });

    const addSteps = steps => {
        setSteps(steps);
        setStep(3);
    };

    const addIngredients = ingredients => {
        setIngredients(ingredients);
        updateDish({
            variables: {
                userId: userId,
                dishId: dishId,
                steps: steps,
                ingredients: ingredients,
            },
        });
    };

    const handleClick = (event, stepNumber) => {
        setStep(stepNumber);
    };

    const RenderForm = props => {
        if (step === 0 || step === 4) return null;
        else if (step === 1) {
            return (
                <AddUrlForm
                    dishId={dishId}
                    userId={userId}
                    category={props.category}
                    onClick={props.onClick}
                />
            );
        } else if (step === 2) {
            return (
                <ItemForm
                    key={dishId + 'steps'}
                    userId={userId}
                    dishId={dishId}
                    onClick={addSteps}
                    type={'steps'}
                />
            );
        } else if (step === 3) {
            return (
                <ItemForm
                    key={dishId + 'ingredients'}
                    userId={userId}
                    dishId={dishId}
                    onClick={addIngredients}
                    type={'ingredients'}
                />
            );
        }
    };

    return (
        <div>
            <Container>
                <Row>
                    <Col sm="12" md={{size: 6, offset: 3}}>
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
                            onClick={e => handleClick(e, 1)}>
                            Add Url of Recipe
                        </Button>
                    </Col>
                    <Col>
                        <Button
                            className="newFormButtons"
                            color="primary"
                            size="lg"
                            value="1"
                            onClick={e => handleClick(e, 2)}>
                            Add Steps Manually
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
