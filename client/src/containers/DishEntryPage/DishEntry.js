import React, {Component} from 'react';
import {Route, Redirect} from 'react-router-dom';
import app from '../../base';
import DishEntryStepsTable from '../../components/DishEntryStepsTable';
import DishEntryIngredientsTable from '../../components/DishEntryIngredientsTable';
import Calendar from '../../components/Calendar';
import Notes from '../../components/Notes';
import NewDishForm from '../../components/NewDishForm';
import {Container, Row, Col} from 'reactstrap';

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
        var get_url =
            '/api/users/' + this.state.user.uid + '/dish/' + this.state.dishId;

        fetch(get_url, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        }).then(response => {
            if (response.status == 200) {
                response.json().then(dish => {
                    this.setState({
                        loaded: true,
                        name: dish.name,
                    });

                    if (dish['ingredients'] && dish['ingredients'].length > 0)
                        this.setState({
                            ingredientsCreated: true,
                            ingredientsArray: dish.ingredients,
                        });

                    if (dish['steps'] && dish['steps'].length > 0)
                        this.setState({
                            stepsCreated: true,
                            stepsArray: dish.steps,
                        });
                });
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
                        <this.renderNewDishForm
                            entryContainsSteps={this.state.stepsCreated}
                        />
                    </Col>
                </Row>
            </div>
        );
    }
}

export default DishEntry;
