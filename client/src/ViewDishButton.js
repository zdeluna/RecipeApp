import React, { Component } from "react";

class ViewDishButton extends Component {
	state = {
		value: "View Dish"
	};

	handleClick = () => {
		console.log();
	};


	render() {
		return (
			<div>
				<button
					onClick={this.props.onClick}
					className="btn btn-secondary btn-sm m10"  
				>{ this.state.value }
				</button>
				
			</div>
		)
	};
}

	export default ViewDishButton;
