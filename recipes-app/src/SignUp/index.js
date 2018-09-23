import React, { Component } from "react";
import { withRouter } from "react-router";
import app from "../base";

import SignUpView from "./SignUpView";

class SignUpContainer extends Component {
	handleSignUp = async event => {
		event.preventDefault();
		const { email, password } = event.target.elements;
		try {
			const user = await app
				.auth()
				.createUserWithEmailAndPassword(email.value, password.value).then(function(user)
					{
						console.log(user);
						var userId = user.user.uid;
						var userData = {
							username: email.value
						};
						console.log("set data");

						
						app.database().ref('users/' + userId).set({
							username: email.value
						});
					});
				this.props.history.push("/");
		}

		catch (error){
			alert(error);
		}
	};

	render() {
		return <SignUpView onSubmit={this.handleSignUp} />;
	}
}

export default withRouter(SignUpContainer);
