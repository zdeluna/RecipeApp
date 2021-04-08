import React from "react";
import { Route, Redirect } from "react-router-dom";

export default function PrivateRoute({
    component: Component,
    authenticated,
    ...rest
}) {
    console.log("IN PROTECTED ROUTE: " + authenticated);
    return (
        <Route
            {...rest}
            render={props =>
                authenticated === true ? (
                    <Component {...props} {...rest} />
                ) : (
                    <Redirect to="/login" />
                )
            }
        />
    );
}
