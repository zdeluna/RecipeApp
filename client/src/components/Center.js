import React from "react";
import { Container } from "reactstrap";

const Center = ({ children }) => {
    return <Container style={style}>{children}</Container>;
};

const style = {
    display: "flex",
    "justify-content": "center",
    "align-items": "center"
};

export default Center;
