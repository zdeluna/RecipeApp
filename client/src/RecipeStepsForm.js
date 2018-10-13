//@format

import React, {Component} from 'react';
import {Route, Redirect} from 'react-router-dom';
import app from './base';
import Step from './Step';

class RecipeStepsForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            value: '',
            user: app.auth().currentUser,
            numberOfSteps: 4,
            stepForms: [
                {id: 1, value: '', visible: false},
                {id: 2, value: '', visible: false},
                {id: 3, value: '', visible: false},
                {id: 4, value: '', visible: true},
            ],
        };
    }

    addStepsToDatabase = async () => {
        // Only send id and value fields from the stepForms array.
        // Create a new array "stepsData" to have the filtered properties

        var stepsData = this.state.stepForms.map(function(step) {
            return {
                id: step.id,
                value: step.value,
            };
        });

        //prettier-ignore
        fetch(`/api/dish/${this.props.dishId}/recipe/steps`, {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				steps: stepsData,
				userID: this.state.user.uid
			})
		})
    };

    addStep = event => {
        // Set the last object of step forms to have a visible property of false
        this.state.stepForms[this.state.numberOfSteps - 1]['visible'] = false;

        // Increase the number of steps listed in the state property
        this.state.numberOfSteps++;

        // https://stackoverflow.com/questions/23966438/what-is-the-preferred-way-to-mutate-a-react-state
        // Concatenate an array with stepForms that includes the new step
        this.setState(state => ({
            stepForms: state.stepForms.concat({
                id: this.state.numberOfSteps,
                value: '',
                visible: true,
            }),
        }));
    };

    handleChange = (id, description) => {
        this.state.stepForms[id - 1].value = description;
        this.forceUpdate();
    };

    handleSubmit = event => {
        //alert('A name was submitted: ' + this.state.value);
        event.preventDefault();
        this.addStepsToDatabase();
    };

    handleDeleteStep = id => {
        this.removeStep(id - 1);
        this.state.numberOfSteps--;

        // Set the visible property of the new last step's delete button as true
        if (this.state.numberOfSteps > 1)
            this.state.stepForms[this.state.numberOfSteps - 1][
                'visible'
            ] = true;
    };

    // https://stackoverflow.com/questions/29527385/removing-element-from-array-in-component-state

    removeStep(id) {
        // Remove the last step object from the stepForms array
        this.setState({
            stepForms: this.state.stepForms.filter((_, i) => i !== id),
        });
    }

    render() {
        return (
            <div>
                <h2>Add Recipe Steps Manually</h2>
                <form onSubmit={this.handleSubmit}>
                    {this.state.stepForms.map(stepForm => (
                        <Step
                            key={stepForm.id}
                            value={stepForm.value}
                            id={stepForm.id}
                            onChange={this.handleChange}
                            onClick={this.handleDeleteStep}
                            onBlue={this.handleChange}
                            deleteButton={stepForm.visible}
                        />
                    ))}
                    <input type="submit" value="submit" />
                    <button type="button" onClick={this.addStep}>
                        Add Step
                    </button>
                </form>
            </div>
        );
    }
}

export default RecipeStepsForm;
