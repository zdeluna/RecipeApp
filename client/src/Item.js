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

class Item extends Component {
    constructor(props) {
        super(props);

        this.state = {
            value: props.value,
            user: app.auth().currentUser,
            id: props.id,
            type: props.type,
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
}

export default Item;
