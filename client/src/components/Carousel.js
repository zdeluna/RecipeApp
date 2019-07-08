import React, {Component} from 'react';
import {Button, Row, Col, Container} from 'reactstrap';
import {Link} from 'react-router-dom';
import API from '../utils/Api';
import './Carousel.css';

class Carousel extends Component {
    constructor(props) {
        super(props);

        this.state = {
            userID: this.props.userID,
            dishId: this.props.dishId,
            steps: this.props.steps,
            ingredients: this.props.ingredients,
            ingredientsInSteps: this.props.ingredientsInSteps,
            currentStep: 0,
            loading: false,
        };
    }

    /* Make a GET request to the database to retrieve the dish information and store it in state */
    componentDidMount = async () => {
        if (!this.state.steps || !this.state.ingredients) {
            await this.getDishIngredientsAndSteps();
            this.setState({loading: false});
        }
    };

    getDishIngredientsAndSteps = async () => {
        this.setState({loading: true});
        var api = new API();
        var response = await api.getDish(this.state.userID, this.state.dishId);
        if (response.status === 200) {
            let dish = response.data;

            if (dish.ingredients && dish.ingredients.length > 0) {
                this.setState({
                    ingredientsCreated: true,
                    ingredientsArray: dish.ingredients,
                });
            }
            if (dish.steps && dish.steps.length > 0) {
                this.setState({
                    stepsCreated: true,
                    stepsArray: dish.steps,
                });
            }

            this.setState({
                name: dish.name,
                loading: false,
                ingredientsInSteps: dish.ingredientsInSteps,
            });
        }
        this.setState({loading: false});
    };

    showNextIngredient = () => {
        let stepNumber = this.state.currentStep + 1;

        /* If the last step is showing, show the first step */
        if (stepNumber === this.state.steps.length) stepNumber = 0;

        this.setState({currentStep: stepNumber});
    };

    showPreviousIngredient = () => {
        let stepNumber = this.state.currentStep - 1;

        /* If the first step is showing, show the last step*/
        if (stepNumber < 1) stepNumber = this.state.steps.length - 1;

        this.setState({currentStep: stepNumber});
    };

    exit = () => {};

    render() {
        return (
            <div>
                <Container>
                    <Row>
                        <Col>
                            <Button
                                color="primary"
                                size="lg"
                                onClick={() => this.showPreviousIngredient()}>
                                Previous
                            </Button>
                        </Col>
                        <Col>
                            <Button
                                color="primary"
                                size="lg"
                                onClick={() => this.showNextIngredient()}>
                                Next
                            </Button>
                        </Col>
                    </Row>

                    <Row>
                        <h1>
                            {this.state.steps[this.state.currentStep].value}
                        </h1>
                    </Row>
                </Container>
                <Container>
                    <h5 id="ingredientsHeading">Ingredients</h5>
                    {this.state.ingredientsInSteps[this.state.currentStep].map(
                        ingredient => (
                            <h5>{ingredient.value}</h5>
                        ),
                    )}
                </Container>
            </div>
        );
    }
}

export default Carousel;
