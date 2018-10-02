import React, { Component } from "react";
import CategoryButton from "./CategoryButton";
import { Route, Redirect } from "react-router-dom";
import app from "./base";
import AddUrlForm from "./AddUrlForm";



class DishEntry extends Component {
	state = {
		user: app.auth().currentUser,
		dishId: this.props.match.params.dishId,
		name: ''
	};

	componentDidMount() {
		
		const dishesRef = app.database().ref().child('dishes').child(this.state.user.uid).child(this.state.dishId);
		dishesRef.on('value', (snapshot) => {
			let dish = snapshot.val();
			this.setState({name: dish["name"]});	
		});
	};
	
	

	render() {

		
		return (
			<div>
				<h1>{this.state.name}</h1>
				<AddUrlForm />
			</div>
		);
	};
}




export default DishEntry;
