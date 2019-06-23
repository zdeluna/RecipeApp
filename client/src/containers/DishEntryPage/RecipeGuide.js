import React, {Component} from 'react';
import {Button, Col, Container, Row} from 'reactstrap';
import Carousel from '../../components/Carousel';
import {Link} from 'react-router-dom';

class RecipeGuide extends Component {
    constructor(props) {
        super(props);

        this.state = {
            steps: this.props.location.state.steps,
            ingredients: this.props.location.state.ingredients,
            dishUrl: '',
        };
        console.log(this.state.steps);
    }
    componentDidMount() {
        // Set the state variable to the dish entry url
        let dishUrl = window.location.pathname;
        dishUrl = dishUrl.replace('/makeMode', '');

        this.setState({dishUrl: dishUrl});
    }

    handleChange = event => {
        this.setState({value: event.target.value});
    };

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

                <Container>
                    <Carousel
                        steps={this.state.steps}
                        ingredients={this.state.ingredients}
                    />
                </Container>
            </div>
        );
    }
}

export default RecipeGuide;
