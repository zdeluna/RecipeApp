import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {Redirect} from 'react-router-dom';
import {Col, Container, Row} from 'reactstrap';
import './Home.css';

class Home extends Component {
    state = {
        redirect: false,
    };

    handleClick = (e, id) => {
        this.setState({redirect: true, category: id});
    };

    render() {
        return (
            <Container>
                <Row>
                    <Col>
                        <Link to={`/signup`}>Signup</Link>
                    </Col>
                    <Col>
                        <Link to={`/login`}>Login</Link>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <h1 className="text-center">Recipe Scheduler</h1>
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default Home;
