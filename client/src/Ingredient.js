//@format
import React, {Component} from 'react';
import {Route, Redirect} from 'react-router-dom';
import app from './base';
import {
    Form,
    Button,
    FormGroup,
    Label,
    Input,
    FormText,
    Container,
} from 'reactstrap';

class Ingredient extends Component {
    constructor(props) {
        super(props);

        this.state = {
            description: props.description,
            user: app.auth().currentUser,
            id: props.id,
        };
    }

    updateInput = newValue => {
        this.setState({value: newValue});
    };

    handleChange = event => {
        this.setState({value: event.target.value}, () => {
            // Update the array contained in the steps form component
            // https://stackoverflow.com/questions/33088482/onchange-in-react-doesnt-capture-the-last-character-of-text

            // Use a asynchronous callback
            this.props.onChange(this.state.id, this.state.value);
        });
    };

    handleDeleteStep = event => {
        this.props.onClick(this.state.id);
    };

    render() {
        return (
            <div>
                <Label>
                    Ingredient #{this.state.id}
                    <Input
                        type="text"
                        value={this.state.description}
                        onChange={this.handleChange}
                        onBlur={() => this.updateInput(this.state.value)}
                        id="newIngredient"
                    />
                </Label>
                {this.props.deleteButton ? (
                    <Button color="danger" onClick={this.handleDeleteStep}>
                        Delete
                    </Button>
                ) : null}
            </div>
        );
    }
}

export default Ingredient;
