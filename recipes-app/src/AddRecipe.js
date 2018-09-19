import React, { Component } from "react";
import { Route, Redirect } from "react-router-dom";
import app from "./base";


class AddRecipe extends Component {

	state = {

		user:null
	}

	componentDidMount() {

		app.auth().onAuthStateChanged(function(user) {
			if (user)
			{
				console.log(user);

			}
		});

	};




	render() {
		return (
		
			<h1>Add Recipe</h1>
		
		);
	};
}

export default AddRecipe;
