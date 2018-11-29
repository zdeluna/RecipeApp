import React, {Component} from 'react';
import {Route, Redirect} from 'react-router-dom';
import app from './base';
import AddUrlForm from './AddUrlForm';
import ItemForm from './ItemForm';
import {Button, Row, Col, Container} from 'reactstrap';
import './Home.css';

class NewDishForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            user: app.auth().currentUser,
            dishId: this.props.dishId,
            step: 0,
        };
    }

    handleClick = (e, stepNumber) => {
        this.setState({step: stepNumber});
    };

    renderForm = props => {
        const step = props.step;
        if (step == 0 || step == 4) return null;
        else if (step == 1) {
            return <AddUrlForm dishId={this.state.dishId} />;
        } else if (step == 2) {
            return (
                <ItemForm
                    dishId={this.state.dishId}
                    onClick={e => this.handleClick(e, 3)}
                    type={'steps'}
                />
            );
        } else if (step == 3) {
            return (
                <ItemForm
                    dishId={this.state.dishId}
                    onClick={e => this.handleClick(e, 4)}
                    type={'ingredients'}
                />
            );
        }
    };

    render() {
        return (
            <div>
                <Container>
                    <Row>
                        <Col sm="12" md={{size: 6, offset: 3}}>
                            <h3>{this.state.name}</h3>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Button
                                color="primary"
                                size="lg"
                                value="0"
                                onClick={e => this.handleClick(e, 1)}>
                                Add Url of Recipe
                            </Button>
                        </Col>
                        <Col>
                            <Button
                                color="primary"
                                size="lg"
                                value="1"
                                onClick={e => this.handleClick(e, 2)}>
                                Add Steps Manually
                            </Button>
                        </Col>
                    </Row>
                    <Row>
                        <Col sm="12" md={{size: 6, offset: 3}}>
                            <this.renderForm step={this.state.step} />
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}

export default NewDishForm;
