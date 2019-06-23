import React, {Component} from 'react';
import {Button, Row, Col, Container} from 'reactstrap';
import {Link} from 'react-router-dom';

class Carousel extends Component {
    constructor(props) {
        super(props);

        this.state = {
            steps: this.props.steps,
            ingredients: this.props.ingredients,
            currentStep: 0,
        };
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
                    <Button
                        color="primary"
                        onClick={() => this.showPreviousIngredient()}>
                        Previous
                    </Button>
                    <h1>{this.state.steps[this.state.currentStep].value}</h1>
                    <Button
                        color="primary"
                        onClick={() => this.showNextIngredient()}>
                        Next
                    </Button>
                </Container>
            </div>
        );
    }
}

export default Carousel;
