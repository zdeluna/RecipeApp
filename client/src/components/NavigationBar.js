import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button, Container, Row, Col } from "reactstrap";
import LogoutButton from "./LogoutButton";

const NavigationBar = props => {
    const handleGoBack = () => {
        props.history.goBack();
    };

    return (
        <Container>
            <Row>
                <Col>
                    <Button
                        id="goBackButton"
                        style={{ color: "#007BFF", fontSize: 20 }}
                        color="none"
                        size="sm"
                        onClick={handleGoBack}
                        active={true}
                    >
                        Go Back
                    </Button>
                </Col>
                <Col>
                    <LogoutButton />
                </Col>
            </Row>
        </Container>
    );
};

export default NavigationBar;
