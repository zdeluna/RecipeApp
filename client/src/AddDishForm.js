import React, {Component} from 'react';
import {Route, Redirect} from 'react-router-dom';
import app from './base';
import {
    Form,
    Button,
    FormGroup,
    Label,
    Input,
    FormText,
    Container,
} from 'reactstrap';
import './AddDishForm.css';

class AddDishForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            value: '',
            user: app.auth().currentUser,
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({value: event.target.value});
    }

    handleSubmit(event) {
        //alert('A name was submitted: ' + this.state.value);
        event.preventDefault();

        const category = 1;

        // Get the category of the dish from the query in the url

        addNewDish(this.state.user.uid, this.state.value, category);
    }

    render() {
        return (
            <div>
                <Container>
                    <Form inline onSubmit={this.handleSubmit}>
                        <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                            <Label for="newDishInput">New Dish Name</Label>
                            <Input
                                type="text"
                                value={this.state.value}
                                onChange={this.handleChange}
                                id="newDishInput"
                            />

                            <Button color="primary">Submit</Button>
                        </FormGroup>
                    </Form>
                </Container>
            </div>
        );
    }
}

function addNewDish(uid, name, category) {
    var newDish = {
        uid: uid,
        name: name,
        category: category,
    };

    var newDishKey = app
        .database()
        .ref()
        .child('dishes')
        .push().key;

    var updates = {};
    updates['/dishes/' + uid + '/' + newDishKey] = newDish;

    return app
        .database()
        .ref()
        .update(updates);
}

export default AddDishForm;
