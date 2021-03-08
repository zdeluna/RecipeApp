import React, { Component } from "react";
import { Route, Switch } from "react-router";
import { BrowserRouter as Router } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";

import Category from "./containers/CategoriesPage/Category";
import LogIn from "./containers/LogInPage/LogIn";
import Home from "./containers/HomePage/Home";
import SignUp from "./containers/SignUpPage/SignUp";
import DishListTable from "./containers/DishListPage/DishListTable";
import DishEntry from "./containers/DishEntryPage/DishEntry";
import RecipeGuide from "./containers/DishEntryPage/RecipeGuide";
import ItemForm from "./components/ItemForm";

const Routes = props => {
    return (
        <Router>
            <div>
                <Switch>
                    <Route exact path="/" component={Home} />
                    <Route exact path="/users/category" component={Category} />
                    <Route exact path="/login" component={LogIn} />
                    <Route exact path="/signup" component={SignUp} />
                    <Route
                        expact
                        path="/users/category/:category/dish/:dishId/makeMode"
                        component={RecipeGuide}
                    />
                    )} />
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
                    <Route
                        exact
                        path="/users/category/:category/dish/:dishId/steps"
                        render={props => (
                            <ItemForm {...props} update={true} type={"steps"} />
                        )}
                    />
                    )} />
                    <Route
                        exact
                        path="/users/category/:category/dish/:dishId"
                        component={DishEntry}
                    />
                    )} />
                    <Route
                        exact
                        path="/users/category/:category"
                        component={DishListTable}
                        loading={true}
                    />
                    )} />
                </Switch>
            </div>
        </Router>
    );
};

export default Routes;
