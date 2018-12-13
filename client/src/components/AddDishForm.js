import React, {Component} from 'react';
import {Route, Redirect} from 'react-router-dom';
import app from '../base';
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
import API from '../utils/Api';

class AddDishForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            value: '',
            user: app.auth().currentUser,
            category: this.props.category,
        };
    }

    handleChange = event => {
        this.setState({value: event.target.value});
    };

    handleSubmit = event => {
        event.preventDefault();

        // Get the category of the dish from the query in the url

        this.addNewDish(
            this.state.user.uid,
            this.state.value,
            this.state.category,
        );
    };

    // Make a call to the api to handle parsing the recipe from the url
    addNewDish = async (userId, dishName, category) => {
        // prettier-ignore

        let newDish = {};
        newDish.name = dishName;
        newDish.category = category;

        const api = new API();
        api.createDish(this.state.user.uid, newDish).then(response => {
            if (response.status == 201) this.props.onClick(response.data.id);
        });
    };

    render() {
        return (
            <div>
                <Container>
                    <Form inline onSubmit={this.handleSubmit}>
                        <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                            <Label for="newDishInput">New Dish Name: </Label>
                            <Input
                                type="text"
                                value={this.state.value}
                                onChange={this.handleChange}
                                id="newDishInput"
                            />
                        </FormGroup>
                        <Button color="primary">Submit</Button>
                    </Form>
                </Container>
            </div>
        );
    }
}

export default AddDishForm;
