//@format

import React, {Component} from 'react';
import {Route, Redirect} from 'react-router-dom';
import app from './base';
import Ingredient from './Ingredient';
import {
    Form,
    Button,
    FormGroup,
    Label,
    Input,
    FormText,
    Container,
} from 'reactstrap';

class IngredientsForm extends Component {
    constructor(props) {
        super(props);

        this.dishId = 0;

        if (this.props.match.params.dishId) {
            this.dishId = this.props.match.params.dishId;
        } else this.dishId = this.props.dishId;

        this.state = {
            value: '',
            user: app.auth().currentUser,
            numberOfIngredients: 4,
            ingredientsArray: [
                {id: 1, value: '', visible: false},
                {id: 2, value: '', visible: false},
                {id: 3, value: '', visible: false},
                {id: 4, value: '', visible: true},
            ],
            update: false,
            dishId: this.dishId,
            redirect: false,
        };
    }

    // Check to see if the ingredients have already been stored in the database
    // by making a get request to the api then update the ingredients array in state
    componentDidMount() {
        fetch(
            `/api/users/${this.state.user.uid}/dish/${
                this.state.dishId
            }/ingredients`,
            {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
            },
        ).then(response => {
            if (response.status == 200) {
                response.json().then(ingredients => {
                    this.setState({
                        update: true,
                        ingredientsArray: ingredients,
                    });
                });
            }
        });
    }

    addIngredientsToDatabase = async () => {
        // If the state update field is true, then we need to make a put request instead of a post request
        var method = 'POST';
        if (this.state.update) method = 'PUT';

        // Only send id and value fields from the stepForms array.
        // Create a new array "stepsData" to have the filtered properties
        var ingredientsData = this.state.ingredientsArray.map(function(
            ingredient,
        ) {
            return {
                id: ingredient.id,
                value: ingredient.value,
            };
        });

        //prettier-ignore
        fetch(`/api/users/${this.state.user.uid}/dish/${this.state.dishId}/ingredients`, {
			method: method,
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				ingredients: ingredientsData,
			})
		}).then(response => {
			// If the response status is 200, then we have created ingredients for the dish the first time, and need to let the parent component, NewDishForm, steps has been added by calling the onClick event.
			if (response.status == 200) this.props.onClick();
			else {
			console.log("redirect");
				this.setState({redirect: true});
		
			}
        });
    };

    addIngredient = event => {
        // Set the last object of step forms to have a visible property of false
        this.state.ingredientsArray[this.state.numberOfIngredients - 1][
            'visible'
        ] = false;

        // Increase the number of steps listed in the state property
        this.state.numberOfIngredients++;

        // https://stackoverflow.com/questions/23966438/what-is-the-preferred-way-to-mutate-a-react-state
        // Concatenate an array with stepForms that includes the new step
        this.setState(state => ({
            ingredientsArray: state.ingredientsArray.concat({
                id: this.state.numberOfIngredients,
                value: '',
                visible: true,
            }),
        }));
    };

    handleChange = (id, value) => {
        this.state.ingredientsArray[id].value = value;
        this.forceUpdate();
    };

    handleSubmit = event => {
        event.preventDefault();
        this.addIngredientsToDatabase();
    };

    handleDeleteIngredient = id => {
        this.removeIngredient(id - 1);
        this.state.numberOfIngredients--;

        // Set the visible property of the new last step's delete button as true
        if (this.state.numberOfIngredients > 1)
            this.state.ingredientsArray[this.state.numberOfIngredients - 1][
                'visible'
            ] = true;
    };

    // https://stackoverflow.com/questions/29527385/removing-element-from-array-in-component-state

    removeIngredient(id) {
        // Remove the last step object from the stepForms array
        this.setState({
            ingredientsArray: this.state.ingredientsArray.filter(
                (_, i) => i !== id,
            ),
        });
    }

    render() {
        if (this.state.redirect) {
            return (
                <Redirect
                    push
                    to={`/users/category/${
                        this.props.match.params.category
                    }/dish/${this.state.dishId}`}
                />
            );
        }

        return (
            <div>
                <Form>
                    {this.state.ingredientsArray.map(ingredient => (
                        <FormGroup>
                            <Ingredient
                                key={ingredient.id}
                                value={ingredient.value}
                                id={ingredient.id}
                                onChange={this.handleChange}
                                onClick={this.handleDeleteStep}
                                onBlur={this.handleChange}
                                deleteButton={ingredient.visible}
                            />
                        </FormGroup>
                    ))}
                    <FormGroup>
                        <Button color="primary" onClick={this.addIngredient}>
                            Add Ingredient
                        </Button>
                        <Button
                            color="primary"
                            onClick={event => this.handleSubmit(event)}>
                            Save
                        </Button>
                    </FormGroup>
                </Form>
            </div>
        );
    }
}

export default IngredientsForm;
