import React, { Component } from "react";
import { Route, Redirect } from "react-router-dom";
import app from "./base";


class AddUrlForm extends Component {
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

		addRecipeUrl(this.state.user.uid, this.props.dishId, this.state.value);
	}


	render() {
		return (
			<div>
				<h2>Add Url</h2>
				<form onSubmit={this.handleSubmit}>
					<label>
						Recipe Url:
					<input type="text" value={this.state.value} onChange={this.handleChange} />
					</label>
						<input type="submit" value="submit" />
				</form>
			</div>
		);
	}
}

function addRecipeUrl(uid, dishId, url)
{

	app.database().ref().child('/dishes/' + uid + '/' + dishId)
		.update({ url: url });

}
		
export default AddUrlForm;
