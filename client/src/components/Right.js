import React from "react";
import { Container } from "reactstrap";

const Right = ({ children }) => {
    return <Container style={style}>{children}</Container>;
};

const style = {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center"
};

export default Right;
