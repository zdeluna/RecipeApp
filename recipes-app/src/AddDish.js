import React, { Component } from "react";
import { Route, Redirect } from "react-router-dom";
import app from "./base";


class AddDish extends Component {
	constructor(props){
		super(props);
		
		this.state = {
			value: '',
			user: app.auth().currentUser
		};

		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}



	handleChange(event) {
		this.setState({value: event.target.value});
	}

	handleSubmit(event){
		//alert('A name was submitted: ' + this.state.value);
		event.preventDefault();

		const category = 1;

		// Get the category of the dish from the query in the url

		addNewDish(this.state.user.uid, this.state.value, category);


	}


	render() {
		return (
			<div>
				<h2>Add Dish</h2>
				<form onSubmit={this.handleSubmit}>
					<label>
						Name:
					<input type="text" value={this.state.value} onChange={this.handleChange} />
					</label>
						<input type="submit" value="submit" />
				</form>
			</div>
		);
	}
}

function addNewDish(uid, name, category)
{
	var newDish = {
		uid: uid,
		name: name,
		category: category
	}

	var newDishKey = app.database().ref().child('dishes').push().key;

	var updates = {};
	updates['/dish/' + newDishKey] = newDish;

	return app.database().ref().update(updates);

}
		
export default AddDish;
