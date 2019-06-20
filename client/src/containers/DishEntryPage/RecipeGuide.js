import React, {Component} from 'react';
import {Form, Button, FormGroup, Label, Input, Container} from 'reactstrap';

class RecipeGuide extends Component {
    constructor(props) {
        super(props);

        this.state = {
            steps: this.props.location.state.steps,
            ingredients: this.props.location.state.ingredients,
        };
    }

    handleChange = event => {
        this.setState({value: event.target.value});
    };

    render() {
        return (
            <div>
                <Container>Recipe Guide</Container>
            </div>
        );
    }
}

export default RecipeGuide;
