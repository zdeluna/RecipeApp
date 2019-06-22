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
            dishUrl: '',
        };
    }

    componentDidMount() {
        // Set the state variable to the dish entry url
        let dishUrl = window.location.pathname;
        dishUrl = dishUrl.replace('/makeMode', '');

        this.setState({dishUrl: dishUrl});
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
                <Row>
                    <Col>
                        <Link to={this.state.dishUrl}>
                            <Button color="warning" onClick={() => this.exit()}>
                                Exit
                            </Button>
                        </Link>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Container>
                            <Button
                                color="primary"
                                onClick={() => this.showPreviousIngredient()}>
                                Previous
                            </Button>
                            <h1>
                                {this.state.steps[this.state.currentStep].value}
                            </h1>
                            <Button
                                color="primary"
                                onClick={() => this.showNextIngredient()}>
                                Next
                            </Button>
                        </Container>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default Carousel;
