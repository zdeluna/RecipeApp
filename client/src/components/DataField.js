import React, {Component} from 'react';
import app from '../base';
import {Button} from 'reactstrap';
import './Notes.css';
import Textarea from 'react-textarea-autosize';
import API from '../utils/Api';

class DataField extends Component {
    constructor(props, type) {
        super(props);
        this.state = {
            user: app.auth().currentUser,
            data: '',
            editField: false,
            fieldCreated: false,
            type: type,
        };
    }

    /* Store the value of the history from the database to the history in state */
    componentDidMount() {
        // First set the dishId and category will be used to create our url for the GET request
        this.setState({
            dishId: this.props.dishId,
            category: this.props.category,
            type: this.props.type,
        });

        var api = new API();
        api.getDish(this.state.user.uid, this.props.dishId).then(response => {
            if (response.status === 200) {
                if (response.data.notes)
                    this.setState({
                        data: response.data.notes,
                        fieldCreated: true,
                    });
            } else if (response.data.cookingTime) {
                this.setState({
                    data: response.data.cookingTime,
                    fieldCreated: true,
                });
            } else {
                this.setState({editField: false});
            }
        });
    }

    /* This function will handle adding the history state object to the database*/
    addFieldToDatabase = (event, notes) => {
        const api = new API();
        let dataObject = {[this.state.type]: this.state.data};
        api.updateDish(this.state.user.uid, this.props.dishId, dataObject)
            .then(response => {
                this.setState({editField: false, fieldCreated: true});
            })
            .catch(error => {
                console.log(error.response);
            });
    };

    /* This function will remove the notes from the database */
    deleteFieldFromDatabase = event => {
        const api = new API();
        let dataObject = {[this.state.type]: ''};
        api.updateDish(this.state.user.uid, this.props.dishId, dataObject)
            .then(response => {
                this.setState({
                    data: null,
                    editField: false,
                    fieldCreated: false,
                });
            })
            .catch(error => {
                console.log(error.response);
            });
    };

    /* Add the date to the history array in state */
    fieldChanged = event => {
        this.setState({data: event.target.value});
    };

    createField = () => {
        this.setState({fieldCreated: true, editField: true});
    };

    editField = () => {
        this.setState({editField: true});
    };

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
                    <Button color="primary" size="md" onClick={this.editFields}>
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
                fieldCreated={this.state.fieldCreated}
                editField={this.state.editField}
            />
        );
    }
}

export default DataField;
