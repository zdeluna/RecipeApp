import React, { Component } from "react";
import { Route, Redirect } from "react-router-dom";
import app from "./base";
import AddDishForm from "./AddDishForm"


class RecipeListTable extends Component {

	state = {

		user: app.auth().currentUser,
		dishes: [],
	
	};

	componentDidMount() {
		
		const dishesRef = app.database().ref().child('dishes').child(this.state.user.uid)
		dishesRef.on('value', (snapshot) => {
			let dishes = snapshot.val();
			let dishArray = [];

			for (let dish in dishes){
				dishArray.push({
					id: dish,
					name: dishes[dish].name				
				});
			}
			console.log(dishArray);
			this.setState({
				dishes: dishArray
			});

		});
	}
	

	render() {
		return (
			<div>
				<h1>List Recipes</h1>

				<ul>
					{this.state.dishes.map(dish => 
					<li key={dish.id}>
						{dish.name}</li>
					)}
					
				
				</ul>


				<AddDishForm />
			</div>
		
		);
	};
}

export default RecipeListTable;
