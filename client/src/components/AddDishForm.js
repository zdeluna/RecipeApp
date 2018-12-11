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
        fetch(`/api/users/${this.state.user.uid}/dish/`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
				name: dishName,
				category: category
            })
		})
		.then(response => response.json())
		.then(data=> {
					// Send the id of the dish to the dishListTable component
				this.props.onClick(data.id);
			
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
