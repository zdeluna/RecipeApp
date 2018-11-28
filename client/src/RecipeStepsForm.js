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

        this.dishId = 0;

        if (this.props.match.params.dishId) {
            this.dishId = this.props.match.params.dishId;
        } else this.dishId = this.props.dishId;

        this.state = {
            value: '',
            user: app.auth().currentUser,
            numberOfSteps: 4,
            stepsArray: [
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

    // Check to see if the steps have already been stored in the database
    // by making a get request to the api then update the steps array in state

    componentDidMount() {
        fetch(
            `/api/users/${this.state.user.uid}/dish/${this.state.dishId}/steps`,
            {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
            },
        ).then(response => {
            if (response.status == 200) {
                response.json().then(steps => {
                    console.log('response: ' + steps);
                    this.setState({
                        update: true,
                        stepsArray: steps,
                    });
                });
            }
        });
    }

    addStepsToDatabase = async () => {
        // If the state update field is true, then we need to make a put request instead of a post request
        var method = 'POST';
        if (this.state.update) method = 'PUT';

        //prettier-ignore
        // Only send id and value fields from the stepsArray array.
        // Create a new array "stepsData" to have the filtered properties

        var stepsData = this.state.stepsArray.map(function(step) {
            return {
                id: step.id,
                value: step.value,
            };
        });

        fetch(
            `/api/users/${this.state.user.uid}/dish/${this.props.dishId}/steps`,
            {
                method: method,
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    steps: stepsData,
                }),
            },
        ).then(response => {
            if (response.status == 200) this.props.onClick();
            else {
                console.log('redirect');
                this.setState({redirect: true});
            }
        });
    };

    addStep = event => {
        // Set the last object of step forms to have a visible property of false
        this.state.stepsArray[this.state.numberOfSteps - 1]['visible'] = false;

        // Increase the number of steps listed in the state property
        this.state.numberOfSteps++;

        // https://stackoverflow.com/questions/23966438/what-is-the-preferred-way-to-mutate-a-react-state
        // Concatenate an array with stepsArray that includes the new step
        this.setState(state => ({
            stepsArray: state.stepsArray.concat({
                id: this.state.numberOfSteps,
                value: '',
                visible: true,
            }),
        }));
    };

    handleChange = (id, value) => {
        this.state.stepsArray[id].value = value;
        this.forceUpdate();
    };

    handleSubmit = event => {
        event.preventDefault();

        //alert('A name was submitted: ' + this.state.value);
        console.log('call add to database function');

        this.addStepsToDatabase();
    };

    handleDeleteStep = id => {
        this.removeStep(id - 1);
        this.state.numberOfSteps--;

        // Set the visible property of the new last step's delete button as true
        if (this.state.numberOfSteps > 1)
            this.state.stepsArray[this.state.numberOfSteps - 1][
                'visible'
            ] = true;
    };

    // https://stackoverflow.com/questions/29527385/removing-element-from-array-in-component-state

    removeStep(id) {
        // Remove the last step object from the stepsArray array
        this.setState({
            stepsArray: this.state.stepsArray.filter((_, i) => i !== id),
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
                    {this.state.stepsArray.map(step => (
                        <FormGroup>
                            <Step
                                key={step.id}
                                value={step.value}
                                id={step.id}
                                onChange={this.handleChange}
                                onClick={this.handleDeleteStep}
                                onBlue={this.handleChange}
                                deleteButton={step.visible}
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
                            Save
                        </Button>
                    </FormGroup>
                </Form>
            </div>
        );
    }
}

export default RecipeStepsForm;
