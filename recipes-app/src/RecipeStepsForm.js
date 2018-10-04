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

		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}



	handleChange(event) {
		this.setState({value: event.target.value});
	}
e
	handleSubmit(event){
		//alert('A name was submitted: ' + this.state.value);
		event.preventDefault();

		const category = 1;

		// Get the category of the dish from the query in the url

		//addRecipeUrl(this.state.user.uid, this.props.dishId, this.state.value);
	}


	render() {
		return (
			<div>
				<h2>Add Recipe Steps Manually</h2>
				<form onSubmit={this.handleSubmit}>
					{this.state.stepForms.map(stepForm => 
						<Step key={stepForm.id} id={stepForm.id} />)}
					<input type="submit" value="submit" />
				</form>
			</div>
		);
	}
}

function addRecipeUrl(uid, dishId, url)
{

	app.database().ref().child('/dishes/' + uid + '/' + dishId)
		.update({ url: url });

}
		
export default RecipeStepsForm;

