import React, {Component} from 'react';
import {Route, Redirect} from 'react-router-dom';
import app from './base';
import NewDishForm from './NewDishForm';

class DishEntry extends Component {
    constructor(props) {
        super(props);

        this.state = {
            user: app.auth().currentUser,
            dishId: this.props.match.params.dishId,
            name: '',
            created: false,
        };
    }

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
            if (
                dish['steps'] &&
                dish['steps'].length > 0 &&
                dish['ingredients'] &&
                dish['ingredients'].length
            )
                this.setState({created: true});
        });
    }

    renderNewDishForm = props => {
        const entryContainsSteps = props.entryContainsSteps;
        if (entryContainsSteps != true) {
            return <NewDishForm dishId={this.state.dishId} />;
        }
        return null;
    };

    render() {
        return (
            <div>
                <h1>{this.state.name}</h1>
                <this.renderNewDishForm
                    entryContainsSteps={this.state.created}
                />
            </div>
        );
    }
}

export default DishEntry;
