import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Col, Container, Row } from "reactstrap";
import "./Home.css";
import screenshot1 from "../../static/images/landingPageImage1.png";
import screenshot2 from "../../static/images/landingPageImage2.png";
import screenshot3 from "../../static/images/landingPageImage3.png";

class Home extends Component {
    state = {
        redirect: false
    };

    handleClick = (e, id) => {
        this.setState({ redirect: true, category: id });
    };

    render() {
        return (
            <Container>
                <Row id="topRow">
                    <Col id="leftColumn" />
                    <Col>
                        <Link className="homeLinks" to={`/signup`}>
                            Signup
                        </Link>

                        <Link className="homeLinks" to={`/login`}>
                            Login
                        </Link>
                    </Col>
                </Row>

                <Row>
                    <Col>
                        <h1 className="display-3">Recipe Scheduler</h1>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <p className="lead">Organize your favorite recipes.</p>
                        <img
                            className="screenshot"
                            src={screenshot1}
                            alt="screenshot1"
                        />
                    </Col>
                </Row>
                <hr />
                <Row>
                    <Col>
                        <p className="lead">
                            Upload recipe from a webpage or enter manually.
                        </p>
                        <img
                            className="screenshot"
                            src={screenshot2}
                            alt="screenshot2"
                        />
                    </Col>
                </Row>
                <hr />
                <Row>
                    <Col>
                        <p className="lead">
                            Easily follow directions without having to scroll
                            back and forth.
                        </p>
                        <img
                            className="screenshot"
                            src={screenshot3}
                            alt="screenshot3"
                        />
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default Home;
