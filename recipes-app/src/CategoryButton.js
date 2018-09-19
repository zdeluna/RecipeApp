import React, { Component } from "react";

class CategoryButton extends Component {
	state = {
		value: this.props.value
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

	export default CategoryButton;
