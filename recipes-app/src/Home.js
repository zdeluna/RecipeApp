import React, { Component } from "react";
import CategoryButton from "./CategoryButton";
import { Route, Redirect } from "react-router-dom";


class Home extends Component {
	state = {
		categoryButtons: [
			{ id: 1, value: "Dinner"},
			{ id: 2, value: "Breakfast"},
			{ id: 3, value: "Salads"},
			{ id: 4, value: "Fast Meals"}
		],

		redirect: false,
		category: 0
	};

	handleClick = (e, id) => {
		console.log('Event Handler Called', id);
		this.setState({ redirect: true, category: id });
		

	};

	render() {

		if (this.state.redirect){
			if (this.state.category === 1)
			{
				return <Redirect push to="users/recipes/1" />;
			}
		}

		return (
			<div>
				{	this.state.categoryButtons.map(categoryButton => 
						<CategoryButton key={categoryButton.id} onClick={((e) => this.handleClick(e, categoryButton.id))} value={categoryButton.value} />)}
			</div>
		);
	};
}




export default Home;
