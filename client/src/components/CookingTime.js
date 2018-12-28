import React, {Component} from 'react';
import app from '../base';
import {Button} from 'reactstrap';
import './Notes.css';
import Textarea from 'react-textarea-autosize';
import API from '../utils/Api';
import DataField from './DataField';

class CookingTime extends DataField {
    constructor(props) {
        super(props, 'cookingTime');
    }

    /* Render the components based on if the user has already sheduled the dish today*/
    renderComponents = props => {
        const editField = props.editField;
        const fieldCreated = props.fieldCreated;

        // User doesn't have any existing notes on the dish
        if (!fieldCreated)
            return (
                <div>
                    <Button
                        color="primary"
                        size="md"
                        onClick={this.createField}>
                        Add Cooking Time
                    </Button>
                </div>
            );

        if (editField)
            return (
                <div>
                    <Textarea
                        id="notesTextArea"
                        onChange={event => this.fieldChanged(event)}
                        value={this.state.data}
                    />{' '}
                    <Button
                        color="primary"
                        size="md"
                        onClick={event =>
                            this.addFieldToDatabase(event, this.state.data)
                        }>
                        Save Cooking Time
                    </Button>
                </div>
            );
        else
            return (
                <div>
                    <Button color="primary" size="md" onClick={this.editField}>
                        Edit Cooking Time
                    </Button>
                    <div id="notesText">
                        <p>{this.getDataFieldValue()}</p>
                    </div>
                </div>
            );
    };

    render() {
        return (
            <this.renderComponents
                fieldCreated={this.state.fieldCreated}
                editField={this.state.editField}
            />
        );
    }
}
export default CookingTime;
