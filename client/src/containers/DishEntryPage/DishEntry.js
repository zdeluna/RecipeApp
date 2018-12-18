import React, {Component} from 'react';
import app from '../../base';
import DishEntryStepsTable from '../../components/DishEntryStepsTable';
import DishEntryIngredientsTable from '../../components/DishEntryIngredientsTable';
import Calendar from '../../components/Calendar';
import Notes from '../../components/Notes';
import NewDishForm from '../../components/NewDishForm';
import {Container, Row, Col} from 'reactstrap';
import API from '../../utils/Api';

class DishEntry extends Component {
    constructor(props) {
        super(props);

        this.state = {
            user: app.auth().currentUser,
            dishId: this.props.match.params.dishId,
            category: this.props.match.params.category,
            name: '',
            stepsCreated: false,
            ingredientsCreated: false,
            loaded: false,
            stepsArray: [],
            ingredientsArray: [],
        };
    }
    /* Make a GET request to the database to retrieve the dish information and store it in state */
    componentDidMount() {
        this.getDishIngredientsAndSteps();
    }

    getDishIngredientsAndSteps() {
        var api = new API();
        api.getDish(this.state.user.uid, this.props.match.params.dishId).then(
            response => {
                if (response.status === 200) {
                    let dish = response.data;
                    this.setState({
                        loaded: true,
                        name: dish.name,
                    });

                    if (dish.ingredients && dish.ingredients.length > 0) {
                        this.setState({
                            ingredientsCreated: true,
                            ingredientsArray: dish.ingredients,
                        });
                    }
                    if (dish.steps && dish.steps.length > 0) {
                        this.setState({
                            stepsCreated: true,
                            stepsArray: dish.steps,
                        });
                    }
                }
            },
        );
    }

    handleStepsAndIngredientsSubmitted = event => {
        this.getDishIngredientsAndSteps();
    };

    renderNewDishForm = props => {
        if (!this.state.stepsCreated && this.state.loaded) {
            return (
                <NewDishForm
                    dishId={this.state.dishId}
                    category={this.state.category}
                    onClick={this.handleStepsAndIngredientsSubmitted}
                />
            );
        } else if (this.state.stepsCreated && this.state.loaded) {
            return (
                <Container>
                    <Row>
                        <Col xs="9">
                            <DishEntryIngredientsTable
                                type="Ingredients"
                                entries={this.state.ingredientsArray}
                                dishId={this.state.dishId}
                                category={this.state.category}
                            />
                        </Col>
                        <Col xs="3">
                            <Calendar
                                dishId={this.state.dishId}
                                category={this.state.category}
                            />
                            <Notes
                                dishId={this.state.dishId}
                                category={this.state.category}
                            />
                        </Col>
                    </Row>
                    <Row>
                        <DishEntryStepsTable
                            type="Directions"
                            entries={this.state.stepsArray}
                            dishId={this.state.dishId}
                            category={this.state.category}
                        />
                    </Row>
                </Container>
            );
        } else return null;
    };

    render() {
        return (
            <div>
                <Row>
                    <Col sm="12" md={{size: 6, offset: 6}}>
                        <h1>{this.state.name}</h1>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <this.renderNewDishForm />
                    </Col>
                </Row>
            </div>
        );
    }
}

export default DishEntry;
