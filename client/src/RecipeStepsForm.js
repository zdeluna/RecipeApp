//@format

import React, {Component} from 'react';
import {Route, Redirect} from 'react-router-dom';
import app from './base';
import Step from './Step';
import {
    Form,
    Button,
    FormGroup,
    Label,
    Input,
    FormText,
    Container,
} from 'reactstrap';

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

    addStepsToDatabase = async stepsData => {
        //prettier-ignore
        fetch(`/api/users/${this.state.user.uid}/dish/${this.props.dishId}/recipe/steps`, {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				steps: stepsData,
			})
		}).then(response => {
			if (response.status == 200)
				console.log(response);
				this.props.onClick();
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
        event.preventDefault();

        //alert('A name was submitted: ' + this.state.value);
        console.log('call add to database function');

        // Only send id and value fields from the stepForms array.
        // Create a new array "stepsData" to have the filtered properties
        /*
        var stepsData = this.state.stepForms.map(function(step) {
            return {
                id: step.id,
                value: step.value,
            };
		});

*/
        var stepsData = [{id: 1, value: 'step 1'}];

        this.addStepsToDatabase(stepsData);
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
                <Form>
                    {this.state.stepForms.map(stepForm => (
                        <FormGroup>
                            <Step
                                key={stepForm.id}
                                value={stepForm.value}
                                id={stepForm.id}
                                onChange={this.handleChange}
                                onClick={this.handleDeleteStep}
                                onBlue={this.handleChange}
                                deleteButton={stepForm.visible}
                            />
                        </FormGroup>
                    ))}
                    <FormGroup>
                        <Button color="primary" onClick={this.addStep}>
                            Add Step
                        </Button>
                        <Button
                            color="primary"
                            onClick={event => this.handleSubmit(event)}>
                            Submit
                        </Button>
                    </FormGroup>
                </Form>
            </div>
        );
    }
}

export default RecipeStepsForm;
