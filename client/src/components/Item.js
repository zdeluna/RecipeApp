//@format
import React, {Component} from 'react';
import {Button, Label, FormGroup, Input} from 'reactstrap';
import './Item.css';
import Textarea from 'react-textarea-autosize';

class Item extends Component {
    constructor(props) {
        super(props);

        this.state = {
            value: props.value,
            type: props.type,
            id: props.id,
        };
    }

    updateInput = newValue => {
        this.setState({value: newValue});
    };

    handleChange = event => {
        console.log(event.target.value);
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
        if (this.state.type === 'steps') {
            return (
                <div>
                    <FormGroup id="formGroup">
                        <Label for="newStep" className="itemLabel">
                            Step #{this.state.id + 1}
                            <Textarea
                                value={this.state.value}
                                onChange={this.handleChange}
                                onBlur={this.handleChange}
                                className="newStep"
                            />
                        </Label>
                        {this.props.deleteButton ? (
                            <Button
                                className="deleteButton"
                                color="danger"
                                onClick={this.handleDeleteStep}>
                                Delete
                            </Button>
                        ) : null}
                    </FormGroup>
                </div>
            );
        } else {
            return (
                <div>
                    <FormGroup>
                        <Label className="itemLabel">
                            Ingredient #{this.state.id + 1}
                            <Input
                                type="text"
                                value={this.state.value}
                                onChange={this.handleChange}
                                onBlur={() =>
                                    this.updateInput(this.state.value)
                                }
                                id={'newIngredientInput' + this.state.id}
                            />
                        </Label>
                        {this.props.deleteButton ? (
                            <Button
                                className="deleteButton"
                                color="danger"
                                onClick={this.handleDeleteStep}>
                                Delete
                            </Button>
                        ) : null}
                    </FormGroup>
                </div>
            );
        }
    }
}

export default Item;
