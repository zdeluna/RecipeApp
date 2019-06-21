import React, {Component} from 'react';
import {Form, Button, FormGroup, Label, Input, Container} from 'reactstrap';
import Carousel from '../../components/Carousel';

class RecipeGuide extends Component {
    constructor(props) {
        super(props);

        this.state = {
            steps: this.props.location.state.steps,
            ingredients: this.props.location.state.ingredients,
        };
        console.log(this.state.steps);
    }

    handleChange = event => {
        this.setState({value: event.target.value});
    };

    render() {
        return (
            <div>
                <Container>Recipe Guide</Container>
                <Container>
                    <Carousel
                        steps={this.state.steps}
                        ingredients={this.state.ingredients}
                    />
                </Container>
            </div>
        );
    }
}

export default RecipeGuide;
