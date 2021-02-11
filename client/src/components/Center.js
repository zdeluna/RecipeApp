import React from "react";
import { Container } from "reactstrap";

const Center = ({ children }) => {
    return <Container style={style}>{children}</Container>;
};

const style = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
};

export default Center;
