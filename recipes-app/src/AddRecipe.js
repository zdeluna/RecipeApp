import React, { Component } from "react";
import { Route, Redirect } from "react-router-dom";
import app from "./base";


class AddRecipe extends Component {
	constructor(props){
		super(props);
		
		this.state = {
			value: '',
			user: null
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
		
		addNewRecipe(1, this.state.value);


	}

	componentDidMount() {

		app.auth().onAuthStateChanged(function(user) {
			if (user)
			{
				console.log(user);
				this.setState({user: user});


			}
		});

	};




	render() {
		return (
			<div>
				<h2>Add Recipe</h2>
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

function addNewRecipe(uid, name)
{
	var newRecipe = {
		uid: uid,
		name: name
	}

	var newDishKey = app.database().ref().child('dishes').push().key;

	var updates = {};
	updates['/dish/' + newDishKey] = newRecipe;

	return app.database().ref().update(updates);

}
		
export default AddRecipe;
