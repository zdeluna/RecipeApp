import React, {Component} from 'react';
import {Form, Button, FormGroup, Label, Input, Container} from 'reactstrap';

class Carousel extends Component {
    constructor(props) {
        super(props);

        this.state = {
            steps: this.props.steps,
            ingredients: this.props.ingredients,
            currentStep: 0,
        };
    }

    componentDidMount() {
        console.log(this.state.currentStep);
    }

    showNextIngredient = () => {
        let stepNumber = this.state.currentStep + 1;
        this.setState({currentStep: stepNumber});
    };

    showPreviousIngredient = () => {
        let stepNumber = this.state.currentStep - 1;

        /* If the first step is showing, show the last step*/
        if (stepNumber < 1) stepNumber = this.state.steps.length - 1;

        this.setState({currentStep: stepNumber});
    };

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
