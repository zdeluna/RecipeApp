import React, {Component} from 'react';
import app from '../base';
import './Notes.css';
import API from '../utils/Api';

class DataField extends Component {
    constructor(props, type) {
        super(props);
        this.state = {
            userID: this.props.userID,
            data: '',
            editField: false,
            fieldCreated: false,
            type: type,
        };
    }

    componentDidMount() {
        // First set the dishId and category will be used to create our url for the GET request
        this.setState({
            dishId: this.props.dishId,
            category: this.props.category,
        });

        var api = new API();
        api.getDish(this.state.userID, this.props.dishId).then(response => {
            if (response.status === 200) {
                if (response.data[this.state.type]) {
                    this.setState({
                        data: response.data[this.state.type],
                        fieldCreated: true,
                    });
                } else {
                    this.setState({editField: false});
                }
            }
        });
    }

    /* This function will handle adding the history state object to the database*/
    addFieldToDatabase = (event, notes) => {
        const api = new API();
        let dataObject = {[this.state.type]: this.state.data};
        api.updateDish(this.state.userID, this.props.dishId, dataObject)
            .then(response => {
                this.setState({editField: false, fieldCreated: true});
            })
            .catch(error => {
                console.log(error.response);
            });
    };

    getDataFieldValue = () => {
        return this.state.data;
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
        this.setState({data: event.target.value});
    };

    createField = () => {
        this.setState({fieldCreated: true, editField: true});
    };

    editField = () => {
        this.setState({editField: true});
    };

    removeDate = (array, index) => {
        // Remove a date from the history array

        return array.filter((_, i) => i !== index);
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

export default DataField;
