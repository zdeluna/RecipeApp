import React, { Component } from "react";
import { Route, Redirect } from "react-router-dom";
import app from "./base";
import AddRecipe from "./AddRecipe"


class RecipeListTable extends Component {

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
			<div>
				<h1>List Recipes</h1>
				<AddRecipe />
			</div>
		
		);
	};
}

export default RecipeListTable;
