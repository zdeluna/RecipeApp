import React, {Component} from 'react';
import {Route, Redirect, BrowserRouter, Link} from 'react-router-dom';
import app from './base';
import {Table, Container, Row, Button} from 'reactstrap';
import './DishEntry.css';

class Notes extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: app.auth().currentUser,
            notes: '',
            editNotes: false,
            updateNotes: false,
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
                        updateNotes: true,
                    });
                });
            } else if (response.status == 404) {
                this.setState({updateNotes: false});
            }
        });
    }

    /* This function will handle adding the history state object to the database*/
    addNotesToDatabase = async event => {
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
				notes: this.state.notes,
			})
		}).then(response => {
			// If the response status is 200, then we have created ingredients for the dish the first time, and need to let the parent component, NewDishForm, steps has been added by calling the onClick event.
			if (response.status == 200 || response.status == 303) {
			this.setState({editNotes: false});

			}
        });
    };

    /* Add the date to the history array in state */
    notesChanged = event => {
        this.setState({notes: event.target.value});
    };

    updateNotes = () => {
        this.setState({editNotes: true});
    };

    deleteNotes = event => {
        this.setState({notes: ''});
        this.addNotesToDatabase(event);
    };

    /* Render the components based on if the user has already sheduled the dish today*/
    renderComponents = props => {
        const editNotes = props.editNotes;
        const updateNotes = props.updateNotes;

        // User doesn't have any existing notes on the dish
        if (!updateNotes)
            return (
                <div>
                    <Button
                        color="primary"
                        size="md"
                        onClick={this.updateNotes}>
                        Create Notes
                    </Button>
                </div>
            );

        if (editNotes)
            return (
                <div>
                    <textarea
                        name="notesTextArea"
                        onChange={event => this.notesChanged(event)}
                        value={this.state.notes}
                    />{' '}
                    <Button
                        color="primary"
                        size="md"
                        onClick={event => this.addNotesToDatabase(event)}>
                        Save Notes
                    </Button>
                </div>
            );
        else
            return (
                <div>
                    <Button
                        color="primary"
                        size="md"
                        onClick={this.updateNotes}>
                        Edit Notes
                    </Button>
                    <Button
                        color="danger"
                        size="md"
                        onClick={event => this.deleteNotes(event)}>
                        Delete Notes
                    </Button>
                    <div id="notesTextArea">{this.state.notes}</div>
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
                editNotes={this.state.editNotes}
                updateNotes={this.state.updateNotes}
            />
        );
    }
}

export default Notes;
