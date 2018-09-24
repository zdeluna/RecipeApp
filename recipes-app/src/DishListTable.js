import React, { Component } from "react";
import { Route, Redirect } from "react-router-dom";
import app from "./base";
import AddDishForm from "./AddDishForm"


class DishListTable extends Component {

	state = {

		user: app.auth().currentUser,
		dishes: [],
		category: this.props.match.params.category
	
	};

	componentDidMount() {
		
		const dishesRef = app.database().ref().child('dishes').child(this.state.user.uid)
		dishesRef.on('value', (snapshot) => {
			let dishes = snapshot.val();
			let dishArray = [];

			for (let dish in dishes){

				// If the dish category parameter matches the url query then add it to the array
				if (dishes[dish].category == this.state.category)
				{
					dishArray.push({
						id: dish,
						name: dishes[dish].name				
					});
				}
			}
		
			console.log(dishArray);
			this.setState({
				dishes: dishArray
			});
		});
	};
		
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

export default DishListTable;
