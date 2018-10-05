import React, { Component } from "react";
import { Route, Redirect } from "react-router-dom";
import app from "./base";
import Step from "./Step";


class RecipeStepsForm extends Component {
	constructor(props){
		super(props);
		
		this.state = {
			value: '',
			user: app.auth().currentUser,
			stepForms: [
			{ id: 1, value: "Enter Step 1"},
			{ id: 2, value: "Enter Step 2"},
			{ id: 3, value: "Enter Step 3"},
			{ id: 4, value: "Enter Step 4"}
			]
		};

	}

	handleChange = (id, description) => {

		this.state.stepForms[id-1].value = description;
		this.forceUpdate();
		
	}


	handleSubmit = (event) => {
		//alert('A name was submitted: ' + this.state.value);
		event.preventDefault();

		updateDatabase(this.state.stepForms, this.state.user.uid, this.props.dishId);
	}


	render() {
		return (
			<div>
				<h2>Add Recipe Steps Manually</h2>
				<form onSubmit={this.handleSubmit}>
					{this.state.stepForms.map(stepForm => 
						<Step key={stepForm.id} value={stepForm.value} id={stepForm.id} onChange={this.handleChange} onBlue={this.handleChange} />)}
					<input type="submit" value="submit" />
				</form>
			</div>
		);
	}
}


function updateDatabase(steps, uid, dishId)
{
	console.log("update database" + steps);
	app.database().ref().child('/dishes/' + uid + '/' + dishId)
		.update({steps: steps});



}
		
export default RecipeStepsForm;

