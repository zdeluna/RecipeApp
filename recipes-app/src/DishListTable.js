import React, { Component } from "react";
import { Route, Redirect, BrowserRouter, Link } from "react-router-dom";
import app from "./base";
import AddDishForm from "./AddDishForm";
import ViewDishButton from "./ViewDishButton";


class DishListTable extends Component {

	state = {

		user: app.auth().currentUser,
		dishes: [],
		category: this.props.match.params.category,
		redirect: false
	
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

	handleClick = (e, id) => {
		console.log("Go to dish");
		
		

	};
		
	render() {
		return (
			<div>
				<h1>List Recipes</h1>

				<ul>
					{this.state.dishes.map(dish => 
					<div>
						<li key={dish.id}>
							<Link key={dish.id} to={`/users/category/${this.state.category}/dish/${dish.id}`}>{dish.name}</Link>
						</li>
					</div>
					)}
				
				</ul>


				<AddDishForm />
			</div>
		
		);
	};
}

export default DishListTable;
