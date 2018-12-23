import React, {Component} from 'react';
import app from '../base';
import {Button} from 'reactstrap';
import './Notes.css';
import Textarea from 'react-textarea-autosize';
import API from '../utils/Api';
import DataField from './DataField';

class CookingTime extends DataField {
    constructor(props) {
        super(props);
        this.state = {
            user: app.auth().currentUser,
            notes: '',
            editNotes: false,
            notesCreated: false,
        };
    }

    /* Render the components based on if the user has already sheduled the dish today*/
    renderComponents = props => {
        const editNotes = props.editNotes;
        const notesCreated = props.notesCreated;

        // User doesn't have any existing notes on the dish
        if (!notesCreated)
            return (
                <div>
                    <Button
                        color="primary"
                        size="md"
                        onClick={this.createNotes}>
                        Add Notes
                    </Button>
                </div>
            );

        if (editNotes)
            return (
                <div>
                    <Textarea
                        id="notesTextArea"
                        onChange={event => this.notesChanged(event)}
                        value={this.state.notes}
                    />{' '}
                    <Button
                        color="primary"
                        size="md"
                        onClick={event =>
                            this.addNotesToDatabase(event, this.state.notes)
                        }>
                        Save Notes
                    </Button>
                </div>
            );
        else
            return (
                <div>
                    <Button color="primary" size="md" onClick={this.editNotes}>
                        Edit Notes
                    </Button>
                    <Button
                        color="danger"
                        size="md"
                        onClick={event => this.deleteNotesFromDatabase(event)}>
                        Delete Notes
                    </Button>
                    <div id="notesText">
                        <p>{this.state.notes}</p>
                    </div>
                </div>
            );
    };

    render() {
        return (
            <this.renderComponents
                notesCreated={this.state.notesCreated}
                editNotes={this.state.editNotes}
            />
        );
    }
}

export default CookingTime;
