import React, {Component} from 'react';
import {Link, Redirect} from 'react-router-dom';
import DishEntryStepsTable from '../../components/DishEntryStepsTable';
import DishEntryIngredientsTable from '../../components/DishEntryIngredientsTable';
import Calendar from '../../components/Calendar';
import Loading from '../../components/Loading';
import Notes from '../../components/Notes';
import CookingTime from '../../components/CookingTime';
import NewDishForm from '../../components/NewDishForm';
import {Container, Row, Col} from 'reactstrap';
import API from '../../utils/Api';
import './DishEntry.css';
import {Button} from 'reactstrap';

class DishEntry extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userID: this.props.userID,
            dishId: this.props.match.params.dishId,
            category: this.props.match.params.category,
            name: '',
            stepsCreated: false,
            ingredientsCreated: false,
            loading: false,
            stepsArray: this.props.steps,
            ingredientsArray: this.props.ingredients,
            ingredientsInStepsArray: this.props.ingredientsInSteps,
            redirect: false,
            delete: false,
            makeDishMode: false,
            url: '',
        };
    }

    /* Make a GET request to the database to retrieve the dish information and store it in state */
    componentDidMount = async () => {
        if (!this.state.stepsArray || !this.state.ingredientsArray) {
            await this.getDishIngredientsAndSteps();
            this.setState({loading: false});
        }
    };

    getDishIngredientsAndSteps = async () => {
        this.setState({loading: true});
        let api = new API();
        let response = await api.getDish(this.state.userID, this.state.dishId);
        if (response.status === 200) {
            let dish = response.data;

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

            if (dish.url) {
                this.setState({url: dish.url});
            }

            this.setState({
                name: dish.name,
                loading: false,
                ingredientsInSteps: dish.ingredientsInSteps,
            });
        }
        this.setState({loading: false});
    };

    makeDishModeButton = event => {
        this.setState({makeDishMode: true});
    };

    handleStepsAndIngredientsSubmitted = event => {
        this.getDishIngredientsAndSteps();
    };

    deleteEntryFromDatabase = () => {
        var api = new API();
        api.deleteDish(this.state.userID, this.state.dishId).then(response => {
            if (response.status === 204) {
                this.setState({delete: true});
            }
        });
    };

    renderNewDishForm = props => {
        if (this.state.delete) {
            let redirect_url = '/users/category/' + this.state.category;

            return <Redirect push to={redirect_url} />;
        }

        if (this.state.makeDishMode) {
            let redirect_url =
                '/users/category/' +
                this.state.category +
                '/dish/' +
                this.state.dishId +
                '/' +
                'makeMode';

            return (
                <Redirect
                    to={{
                        pathname: redirect_url,
                        state: {
                            steps: this.state.stepsArray,
                            ingredients: this.state.ingredientsArray,
                            ingredientsInSteps: this.state.ingredientsInSteps,
                        },
                    }}
                />
            );
        }

        if (this.state.loading) return <Loading />;

        if (!this.state.stepsCreated) {
            return (
                <NewDishForm
                    dishId={this.state.dishId}
                    category={this.state.category}
                    onClick={this.handleStepsAndIngredientsSubmitted}
                />
            );
        } else {
            return (
                <Container>
                    <Row>
                        <Col xs="8">
                            <DishEntryIngredientsTable
                                type="Ingredients"
                                entries={this.state.ingredientsArray}
                                dishId={this.state.dishId}
                                category={this.state.category}
                            />
                        </Col>
                        <Col xs="4">
                            <Calendar
                                dishId={this.state.dishId}
                                category={this.state.category}
                                userID={this.state.userID}
                            />
                            <hr />
                            <Notes
                                dishId={this.state.dishId}
                                category={this.state.category}
                                userID={this.state.userID}
                            />
                            <hr />
                            <CookingTime
                                dishId={this.state.dishId}
                                category={this.state.category}
                                userID={this.state.userID}
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
        }
    };

    render() {
        return (
            <div id="dishEntryContainer">
                <Row>
                    <Col>
                        {' '}
                        <Link
                            to={`/users/category/${this.state.category}`}
                            id="goBackLink">
                            Go Back
                        </Link>
                    </Col>
                    <Col sm="2" md={{size: 2, offset: 3}}>
                        <Button
                            id="makeDishModeButton"
                            color="success"
                            size="sm"
                            onClick={this.makeDishModeButton}>
                            Make Dish Mode
                        </Button>
                    </Col>
                </Row>

                <Row>
                    <Col className="text-center">
                        <h1>{this.state.name}</h1>
                        <a href={this.state.url}>
                            <h5>{this.state.url}</h5>
                        </a>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <this.renderNewDishForm />
                    </Col>
                </Row>
                <Row>
                    <Col sm="2" md={{size: 2, offset: 0}}>
                        <Button
                            id="deleteDishButton"
                            color="danger"
                            size="sm"
                            onClick={this.deleteEntryFromDatabase}>
                            Delete Entry
                        </Button>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default DishEntry;
