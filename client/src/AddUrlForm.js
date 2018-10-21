import React, {Component} from 'react';
import {Route, Redirect} from 'react-router-dom';
import app from './base';

class AddUrlForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            value: '',
            user: app.auth().currentUser,
        };
    }

    handleChange = event => {
        this.setState({value: event.target.value});
    };

    handleSubmit = event => {
        //alert('A name was submitted: ' + this.state.value);
        event.preventDefault();

        const category = 1;

        // Get the category of the dish from the query in the url

        //addRecipeUrl(this.state.user.uid, this.props.dishId, this.state.value);
        this.addRecipeLink();
    };

    // Make a call to the api to handle parsing the recipe from the url
    addRecipeLink = async () => {
        // prettier-ignore
        fetch(`/api/users/${this.state.user.uid}/dish/${this.props.dishId}/recipe/url`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                url: this.state.value,
            })
        })
    };

    render() {
        return (
            <div>
                <h2>Add Url</h2>
                <form onSubmit={this.handleSubmit}>
                    <label>
                        Recipe Url:
                        <input
                            type="text"
                            value={this.state.value}
                            onChange={this.handleChange}
                        />
                    </label>
                    <input type="submit" value="submit" />
                </form>
            </div>
        );
    }
}

export default AddUrlForm;
