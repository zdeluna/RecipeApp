import React from "react";
import { Container } from "reactstrap";

const Right = ({ children }) => {
    return <Container style={style}>{children}</Container>;
};

const style = {
    display: "flex",
    "justify-content": "flex-end",
    "align-items": "center"
};

export default Right;
