//@format
import React, {Component} from 'react';
import {Button, Label, Input} from 'reactstrap';

class Item extends Component {
    constructor(props) {
        super(props);

        this.state = {
            value: props.value,
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

    render() {
        if (this.state.type === 'steps') {
            return (
                <div>
                    <Label for="newStep">
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
        } else {
            return (
                <div>
                    <Label>
                        Ingredient #{this.state.id + 1}
                        <Input
                            type="text"
                            value={this.state.value}
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
}

export default Item;
