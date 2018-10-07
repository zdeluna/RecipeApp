import React, { Component } from "react";
import { Route, Redirect } from "react-router-dom";
import app from "./base";


class Step extends Component {
	constructor(props){
		super(props);
		
		this.state = {
			description: props.description, 
			user: app.auth().currentUser,
			id: props.id,
			deleteButtonVisible: false
		};

	}

	updateInput = (newValue) => {
		this.setState({value: newValue});
		console.log(this.state.value);
	}


	handleChange = (event) => {
		this.setState({value: event.target.value}, () => {

			// Update the array contained in the steps form component
			// https://stackoverflow.com/questions/33088482/onchange-in-react-doesnt-capture-the-last-character-of-text

			// Use a asynchronous callback
			this.props.onChange(this.state.id, this.state.value);

			

		});

	}

	handleDeleteStep = (event) => {
		this.props.onClick(this.state.id);


	}


	render() {
		return (
			<div>
				<label>
					Step #{this.state.id}
					<input type="text" value={this.state.description} 
						onChange={this.handleChange} onBlur={() => this.updateInput(this.state.value)} />
				</label>
				{ this.props.deleteButton ? <button type="button" onClick={this.handleDeleteStep}>Delete</button> : null }
			</div>
		);
	}
}


export default Step;
