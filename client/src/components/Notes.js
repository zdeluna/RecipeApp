import React, {Component} from 'react';
import {Route, Redirect, BrowserRouter, Link} from 'react-router-dom';
import app from '../base';
import {Table, Container, Row, Button} from 'reactstrap';
import './Notes.css';
import Textarea from 'react-textarea-autosize';

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

        var get_url =
            '/api/users/' +
            this.state.user.uid +
            '/dish/' +
            this.props.dishId +
            '/notes';

        fetch(get_url, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        }).then(response => {
            if (response.status == 200) {
                response.json().then(data => {
                    this.setState({
                        notes: data,
                        notesCreated: true,
                    });
                });
            } else if (response.status == 404) {
                this.setState({updateNotes: false});
            }
        });
    }

    /* This function will handle adding the history state object to the database*/
    addNotesToDatabase = (event, notes) => {
        console.log('CLIENT: add notes to database');
        event.persist();
        // If the state update field is true, then we need to make a put request instead of a post request
        var method = 'POST';
        if (this.state.updateNotes) method = 'PUT';

        var update_url =
            '/api/users/' +
            this.state.user.uid +
            '/dish/' +
            this.state.dishId +
            '/notes';

        //prettier-ignore
        fetch(update_url, {
			method: method,
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				notes: notes,
			})
		}).then(response => {
			// If the response status is 200, then we have created ingredients for the dish the first time, and need to let the parent component, NewDishForm, steps has been added by calling the onClick event.
			if (response.status == 200 || response.status == 303) {
			this.setState({editNotes: false, notesCreated: true});

			}
        });
    };

    /* This function will remove the notes from the database */
    deleteNotesFromDatabase = event => {
        var method = 'PUT';

        var update_url =
            '/api/users/' +
            this.state.user.uid +
            '/dish/' +
            this.state.dishId +
            '/notes';

        //prettier-ignore
        fetch(update_url, {
			method: method,
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				notes: '',
			})
		}).then(response => {
			// If the response status is 200, then we have created ingredients for the dish the first time, and need to let the parent component, NewDishForm, steps has been added by calling the onClick event.
			if (response.status == 200 || response.status == 303) {
			this.setState({notes: null, editNotes: false, notesCreated: false});

			}
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
