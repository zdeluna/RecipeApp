import React, {Component} from 'react';
import {withRouter} from 'react-router';
import app from '../../base';

import SignUpView from './SignUpView';

class SignUpContainer extends Component {
    handleSignUp = async event => {
        event.preventDefault();
        const {email, password} = event.target.elements;
        try {
            await app
                .auth()
                .createUserWithEmailAndPassword(email.value, password.value)
                .then(function(user) {
                    var userId = user.user.uid;
                    var userData = {
                        username: email.value,
                    };

                    app.database()
                        .ref('users/' + userId)
                        .set({
                            userData,
                        });
                });
            this.props.history.push('/');
        } catch (error) {
            alert(error);
        }
    };

    render() {
        return <SignUpView onSubmit={this.handleSignUp} />;
    }
}

export default withRouter(SignUpContainer);
