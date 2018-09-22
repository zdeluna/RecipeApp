import React, { Component } from "react";
import { Route, Redirect } from "react-router-dom";
import app from "./base";
import AddDishForm from "./AddDishForm"


class RecipeListTable extends Component {

	state = {

		user: app.auth().currentUser,
		dishes: []

	}

	componentDidMount() {
		
		//return app.database.ref('/dish/' + )
		
	};




	render() {
		return (
			<div>
				<h1>List Recipes</h1>
				<AddDishForm />
			</div>
		
		);
	};
}

export default RecipeListTable;
