import React from "react";
import { Route, Redirect } from "react-router-dom";
import NavigationBar from "./components/NavigationBar";

export default function PrivateRoute({
    component: Component,
    authenticated,
    ...rest
}) {
    return (
        <Route
            {...rest}
            render={props =>
                authenticated === true ? (
                    <div>
                        <NavigationBar {...props} />
                        <Component {...props} {...rest} />
                    </div>
                ) : (
                    <Redirect to="/login" />
                )
            }
        />
    );
}
