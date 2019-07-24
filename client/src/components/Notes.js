import React from 'react';
import {Button} from 'reactstrap';
import './Notes.css';
import Textarea from 'react-textarea-autosize';
import DataField from './DataField';

class Notes extends DataField {
    constructor(props) {
        super(props, 'notes');
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
                        Add Notes
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
                        Save Notes
                    </Button>
                </div>
            );
        else
            return (
                <div>
                    <Button color="primary" size="md" onClick={this.editField}>
                        Edit Notes
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
export default Notes;
