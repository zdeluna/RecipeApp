import React, {Component} from 'react';
import CategoryButton from './CategoryButton';
import {Route, Redirect} from 'react-router-dom';
import app from './base';
import NewDishForm from './NewDishForm';

class DishEntry extends Component {
    state = {
        user: app.auth().currentUser,
        dishId: this.props.match.params.dishId,
        name: '',
        created: false,
    };

    componentDidMount() {
        const dishesRef = app
            .database()
            .ref()
            .child('dishes')
            .child(this.state.user.uid)
            .child(this.state.dishId);
        dishesRef.on('value', snapshot => {
            let dish = snapshot.val();
            this.setState({name: dish['name']});
            // If steps and ingredients have already been saved, then set this.state.created to true
            if (dish['steps'].length > 0) this.setState({created: true});
        });
    }

    render() {
        return (
            <div>
                <h1>{this.state.name}</h1>
                <NewDishForm dishId={this.state.dishId} />
            </div>
        );
    }
}

export default DishEntry;
