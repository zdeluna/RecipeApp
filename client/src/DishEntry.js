import React, {Component} from 'react';
import {Route, Redirect} from 'react-router-dom';
import app from './base';
import DishEntryStepsTable from './DishEntryStepsTable';
import DishEntryIngredientsTable from './DishEntryIngredientsTable';
import Calendar from './Calendar';
import NewDishForm from './NewDishForm';

class DishEntry extends Component {
    constructor(props) {
        super(props);

        this.state = {
            user: app.auth().currentUser,
            dishId: this.props.match.params.dishId,
            category: this.props.match.params.category,
            name: '',
            stepsCreated: false,
            loaded: false,
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
                    stepsCreated: true,
                    loaded: true,
                    stepsArray: dish.steps,
                    ingredientsArray: dish.ingredients,
                });
            } else {
                this.setState({stepsCreated: false, loaded: true});
            }
        });
    }

    componentWillUnmount() {
        this.dishesRef.off();
    }

    renderNewDishForm = props => {
        const entryContainsSteps = props.entryContainsSteps;
        if (!this.state.stepsCreated && this.state.loaded) {
            return <NewDishForm dishId={this.state.dishId} />;
        } else if (this.state.stepsCreated && this.state.loaded) {
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
                        dishId={this.state.dishId}
                        category={this.state.category}
                    />

                    <Calendar>
                        dishId=
                        {this.state.dishId}
                        category=
                        {this.state.category}
                    </Calendar>
                </div>
            );
        } else return null;
    };

    render() {
        return (
            <div>
                <h1>{this.state.name}</h1>
                <this.renderNewDishForm
                    entryContainsSteps={this.state.stepsCreated}
                />
            </div>
        );
    }
}

export default DishEntry;
