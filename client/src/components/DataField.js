import {Component} from 'react';
import './Notes.css';
import API from '../utils/Api';

class DataField extends Component {
    constructor(props, type) {
        super(props);
        this.state = {
            userID: this.props.userID,
            data: this.props.data,
            editField: false,
            fieldCreated: false,
            type: type,
        };
        if (this.state.data) this.state.fieldCreated = true;
    }

    /* This function will handle adding the history state object to the database*/
    addFieldToDatabase = (event, notes) => {
        let dataObject = {[this.state.type]: this.state.data};
        this.props.updateCurrentDish(dataObject);
        this.setState({editField: false, fieldCreated: true});
    };

    /* This function will remove the notes from the database */
    deleteFieldFromDatabase = event => {
        const api = new API();
        let dataObject = {[this.state.type]: ''};
        api.updateDish(this.state.userID, this.props.dishId, dataObject)
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
        console.log('CHANGED: ' + this.state.data);
        this.setState({data: event.target.value});
    };

    createField = () => {
        this.setState({fieldCreated: true, editField: true});
    };

    editField = () => {
        this.setState({editField: true});
    };
}

export default DataField;
