//@format
import React, {Component} from 'react';
import {Route, Redirect} from 'react-router-dom';
import app from './base';
import Item from './Item';
import {
    Form,
    Button,
    FormGroup,
    Label,
    Input,
    FormText,
    Container,
} from 'reactstrap';

class Step extends Item {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <Label for="newStepInput">
                    Step #{this.state.id + 1}
                    <Input
                        type="text"
                        value={this.state.value}
                        onChange={this.handleChange}
                        onBlur={() => this.updateInput(this.state.value)}
                        id="newStep"
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

export default Step;
