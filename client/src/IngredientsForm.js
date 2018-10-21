//@format

import React, {Component} from 'react';
import {Route, Redirect} from 'react-router-dom';
import app from './base';
import Ingredient from './Ingredient';

class IngredientsForm extends Component {
    constructor(props) {
        super(props);

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
        };
    }

    addIngredientsToDatabase = async () => {
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
        fetch(`/api/users/${this.state.user.uid}/dish/${this.props.dishId}/recipe/ingredients`, {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				ingredients: ingredientsData,
			})
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

    handleChange = (id, description) => {
        this.state.ingredientsArray[id - 1].value = description;
        this.forceUpdate();
    };

    handleSubmit = event => {
        //alert('A name was submitted: ' + this.state.value);
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
        return (
            <div>
                <h2>Add Ingredients Manually</h2>
                <form onSubmit={this.handleSubmit}>
                    {this.state.ingredientsArray.map(ingredient => (
                        <Ingredient
                            key={ingredient.id}
                            value={ingredient.value}
                            id={ingredient.id}
                            onChange={this.handleChange}
                            onClick={this.handleDeleteStep}
                            onBlur={this.handleChange}
                            deleteButton={ingredient.visible}
                        />
                    ))}
                    <input type="submit" value="submit" />
                    <button type="button" onClick={this.addIngredient}>
                        Add Ingredient
                    </button>
                </form>
            </div>
        );
    }
}

export default IngredientsForm;
