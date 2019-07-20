import React, {Component} from 'react';
import {Button, Col, Row} from 'reactstrap';
import Carousel from '../../components/Carousel';
import {Link} from 'react-router-dom';

class RecipeGuide extends Component {
    constructor(props) {
        super(props);

        this.state = {
            userID: this.props.userID,
            dishId: this.props.match.params.dishId,
            category: this.props.match.params.category,
            steps: this.props.location.state.steps,
            ingredients: this.props.location.state.ingredients,
            ingredientsInSteps: this.props.location.state.ingredientsInSteps,
            dishUrl: '',
        };
    }
    componentDidMount() {
        // Set the state variable to the dish entry url
        let dishUrl = window.location.pathname;
        dishUrl = dishUrl.replace('/makeMode', '');

        this.setState({dishUrl: dishUrl});
    }

    render() {
        return (
            <div>
                <Row>
                    <Col>
                        <Link to={this.state.dishUrl}>
                            <Button color="warning">Exit</Button>
                        </Link>
                    </Col>
                </Row>

                <Carousel
                    dishId={this.state.dishId}
                    userID={this.state.userID}
                    steps={this.state.steps}
                    ingredients={this.state.ingredients}
                    ingredientsInSteps={this.state.ingredientsInSteps}
                />
            </div>
        );
    }
}

export default RecipeGuide;
