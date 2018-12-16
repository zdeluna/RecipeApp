import React, {Component} from 'react';
import {Route, Redirect, BrowserRouter, Link} from 'react-router-dom';
import app from '../base';
import {Table, Container, Row, Button} from 'reactstrap';
import './Notes.css';
import Textarea from 'react-textarea-autosize';
import API from '../utils/Api';

class Notes extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: app.auth().currentUser,
            notes: '',
            editNotes: false,
            notesCreated: false,
        };
    }

    /* Store the value of the history from the database to the history in state */
    componentDidMount() {
        // First set the dishId and category will be used to create our url for the GET request
        this.setState({
            dishId: this.props.dishId,
            category: this.props.category,
        });

        var api = new API();
        api.getDish(this.state.user.uid, this.props.dishId).then(response => {
            if (response.status == 200) {
                if (response.data.notes)
                    this.setState({
                        notes: response.data.notes,
                        notesCreated: true,
                    });
            } else {
                this.setState({updateNotes: false});
            }
        });
    }

    /* This function will handle adding the history state object to the database*/
    addNotesToDatabase = (event, notes) => {
        const api = new API();
        let notesField = {notes: this.state.notes};
        api.updateDish(this.state.user.uid, this.props.dishId, notesField)
            .then(response => {
                this.setState({editNotes: false, notesCreated: true});
            })
            .catch(error => {
                console.log(error.response);
            });
    };

    /* This function will remove the notes from the database */
    deleteNotesFromDatabase = event => {
        const api = new API();
        let notesField = {notes: ''};
        api.updateDish(this.state.user.uid, this.props.dishId, notesField)
            .then(response => {
                this.setState({
                    notes: null,
                    editNotes: false,
                    notesCreated: false,
                });
            })
            .catch(error => {
                console.log(error.response);
            });
    };

    /* Add the date to the history array in state */
    notesChanged = event => {
        this.setState({notes: event.target.value});
    };

    createNotes = () => {
        this.setState({notesCreated: true, editNotes: true});
    };

    editNotes = () => {
        this.setState({editNotes: true});
    };

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

    removeDate(array, index) {
        // Remove a date from the history array

        return array.filter((_, i) => i !== index);
    }

    render() {
        return (
            <this.renderComponents
                notesCreated={this.state.notesCreated}
                editNotes={this.state.editNotes}
            />
        );
    }
}

export default Notes;
