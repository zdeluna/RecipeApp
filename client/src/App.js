import React, { Component } from "react";

import "./App.css";
import Routes from "./Routes";

const App = props => {
    return <Routes history={props.history} />;
};

export default App;
