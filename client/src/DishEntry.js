import React, {Component} from 'react';
import {Route, Redirect} from 'react-router-dom';
import app from './base';
import DishEntryStepsTable from './DishEntryStepsTable';
import DishEntryIngredientsTable from './DishEntryIngredientsTable';

import NewDishForm from './NewDishForm';

class DishEntry extends Component {
    constructor(props) {
        super(props);

        this.state = {
            user: app.auth().currentUser,
            dishId: this.props.match.params.dishId,
            category: this.props.match.params.category,
            name: '',
            created: false,
            stepsArray: [],
            ingredientsArray: [],
        };
    }

    componentDidMount() {
        this.dishesRef = app
            .database()
            .ref()
            .child('dishes')
            .child(this.state.user.uid)
            .child(this.state.dishId);
        this.dishesRef.on('value', snapshot => {
            let dish = snapshot.val();
            this.setState({name: dish['name']});
            // If steps and ingredients have already been saved, then set this.state.created to true
            if (
                dish['steps'] &&
                dish['steps'].length > 0 &&
                dish['ingredients'] &&
                dish['ingredients'].length
            ) {
                this.setState({
                    created: true,
                    stepsArray: dish.steps,
                    ingredientsArray: dish.ingredients,
                });
            }
        });
    }

    componentWillUnmount() {
        this.dishesRef.off();
    }

    renderNewDishForm = props => {
        const entryContainsSteps = props.entryContainsSteps;
        if (entryContainsSteps != true) {
            return <NewDishForm dishId={this.state.dishId} />;
        } else {
            return (
                <div>
                    <DishEntryIngredientsTable
                        type="Ingredients"
                        entries={this.state.ingredientsArray}
                        dishId={this.state.dishId}
                        category={this.state.category}
                    />

                    <DishEntryStepsTable
                        type="Directions"
                        entries={this.state.stepsArray}
                    />
                </div>
            );
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
