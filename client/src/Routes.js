import React, { useState, useContext, useEffect, Component } from "react";
import { Route, Switch } from "react-router";
import { Router } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";

import Category from "./containers/CategoriesPage/Category";
import LogIn from "./containers/LogInPage/LogIn";
import Home from "./containers/HomePage/Home";
import SignUp from "./containers/SignUpPage/SignUp";
import DishListTable from "./containers/DishListPage/DishListTable";
import DishEntry from "./containers/DishEntryPage/DishEntry";
import RecipeGuide from "./containers/DishEntryPage/RecipeGuide";
import ItemForm from "./components/ItemForm";
import { GET_USER } from "./api/queries/user/getUser";
import { useApolloClient } from "@apollo/react-hooks";
import { AuthContext } from "./AuthProvider";

const Routes = props => {
    const [authenticated, setAuthenticated] = useState(true);
    const client = useApolloClient();

    const { user } = useContext(AuthContext);
    if (user) {
        let watcher = client.cache.watch({
            query: GET_USER,
            variables: { id: user.id },

            callback: data => {
                if (data.result.user == null) {
                    console.log("Set auth to false");
                    setAuthenticated(false);
                } else {
                    console.log("Set auth to true");
                    setAuthenticated(true);
                }
            }
        });
    }

    return (
        <Router history={props.history}>
            <div>
                <Switch>
                    <Route exact path="/" component={Home} />
                    <PrivateRoute
                        exact
                        path="/users/category"
                        component={Category}
                        authenticated={authenticated}
                    />
                    <Route exact path="/login" component={LogIn} />
                    <Route exact path="/signup" component={SignUp} />
                    <PrivateRoute
                        expact
                        path="/users/category/:category/dish/:dishId/makeMode"
                        component={RecipeGuide}
                        authenticated={authenticated}
                    />
                    )} />
                    <Route
                        exact
                        path="/users/category/:category/dish/:dishId/steps"
                        render={props => (
                            <ItemForm {...props} update={true} type={"steps"} />
                        )}
                        authenticated={authenticated}
                    />
                    <Route
                        exact
                        path="/users/category/:category/dish/:dishId/ingredients"
                        render={props => (
                            <ItemForm
                                {...props}
                                update={true}
                                type={"ingredients"}
                            />
                        )}
                    />
                    )} />
                    <PrivateRoute
                        exact
                        path="/users/category/:category/dish/:dishId"
                        component={DishEntry}
                        authenticated={authenticated}
                        showMakeDishButton={true}
                    />
                    )} />
                    <PrivateRoute
                        exact
                        path="/users/category/:category"
                        component={DishListTable}
                        loading={true}
                        authenticated={authenticated}
                    />
                    )} />
                </Switch>
            </div>
        </Router>
    );
};

export default Routes;
