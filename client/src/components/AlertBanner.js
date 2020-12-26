import React from "react";
import { Container } from "reactstrap";

const AlertBanner = ({ message }) => {
    return (
        <Container style={styles.container}>
            <div id="alertText" style={styles.alertText}>
                {message}
            </div>
        </Container>
    );
};

const styles = {
    container: {
        backgroundColor: "red",
        marginTop: 40,
        height: 30
    },
    alertText: {
        color: "#333333"
    }
};

export default AlertBanner;
