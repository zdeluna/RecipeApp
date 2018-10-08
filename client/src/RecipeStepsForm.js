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

        updateDatabase(
            this.state.stepForms,
            this.state.user.uid,
            this.props.dishId,
        );
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

function updateDatabase(steps, uid, dishId) {
    console.log('update database' + steps);
    app.database()
        .ref()
        .child('/dishes/' + uid + '/' + dishId)
        .update({steps: steps});
}

export default RecipeStepsForm;
