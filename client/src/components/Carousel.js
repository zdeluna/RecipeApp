import React, {Component} from 'react';
import {Button, Row, Col, Container} from 'reactstrap';
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
        console.log(this.state.ingredientsInSteps);
    }

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
                            <h3>
                                {this.state.currentStep + 1}/
                                {this.state.steps.length}
                            </h3>
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
                            {this.state.currentStep + 1}
                            ).
                            {this.state.steps[this.state.currentStep].value}
                        </h1>
                    </Row>
                </Container>
                <Container>
                    <h5 id="ingredientsHeading">Ingredients</h5>
                    {this.state.ingredientsInSteps[
                        this.state.currentStep
                    ].ingredients.map((ingredient, index) => (
                        <h5 key={'ingredient' + index}>{ingredient.value}</h5>
                    ))}
                </Container>
            </div>
        );
    }
}

export default Carousel;
