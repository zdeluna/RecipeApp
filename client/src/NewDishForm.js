import React, {Component} from 'react';
import CategoryButton from './CategoryButton';
import {Route, Redirect} from 'react-router-dom';
import app from './base';
import AddUrlForm from './AddUrlForm';
import RecipeStepsForm from './RecipeStepsForm';
import IngredientsForm from './IngredientsForm';

class NewDishForm extends Component {
    state = {
        user: app.auth().currentUser,
        dishId: this.props.match.params.dishId,
    };

    componentDidMount() {}

    render() {
        return (
            <div>
                <h1>{this.state.name}</h1>
                <AddUrlForm dishId={this.state.dishId} />
                <RecipeStepsForm dishId={this.state.dishId} />
                <IngredientsForm dishId={this.state.dishId} />
            </div>
        );
    }
}

export default NewDishForm;
