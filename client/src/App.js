import React, {Component} from 'react';
import {Route, Switch} from 'react-router';
import {BrowserRouter as Router} from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import app from './base';

import Category from './containers/CategoriesPage/Category';
import LogIn from './containers/LogInPage/LogIn';
import SignUp from './containers/SignUpPage/SignUp';
import DishListTable from './containers/DishListPage/DishListTable';
import DishEntry from './containers/DishEntryPage/DishEntry';
import RecipeGuide from './containers/DishEntryPage/RecipeGuide';
import ItemForm from './components/ItemForm';
import './App.css';

class App extends Component {
    state = {loading: true, authenticated: false, user: null};

    componentWillMount() {
        app.auth().onAuthStateChanged(user => {
            if (user) {
                this.setState({
                    authenticated: true,
                    currentUser: user,
                    loading: false,
                });
            } else {
                this.setState({
                    authenticated: false,
                    currentUser: null,
                    loading: false,
                });
            }
        });
    }

    render() {
        const {authenticated, loading} = this.state;

        if (loading) {
            return <p>Loading..</p>;
        }

        return (
            <Router>
                <div>
                    <Switch>
                        <PrivateRoute
                            exact
                            path="/users/category"
                            component={Category}
                            authenticated={authenticated}
                        />
                        <Route exact path="/login" component={LogIn} />
                        <Route exact path="/signup" component={SignUp} />
                        <Route
                            expact
                            path="/users/category/:category/dish/:dishId/makeMode"
                            render={props => (
                                <RecipeGuide
                                    {...props}
                                    userID={app.auth().currentUser.uid}
                                    loading={true}
                                />
                            )}
                        />

                        <Route
                            exact
                            path="/users/category/:category/dish/:dishId/ingredients"
                            render={props => (
                                <ItemForm
                                    {...props}
                                    update={true}
                                    type={'ingredients'}
                                />
                            )}
                        />
                        <Route
                            exact
                            path="/users/category/:category/dish/:dishId/steps"
                            render={props => (
                                <ItemForm
                                    {...props}
                                    update={true}
                                    type={'steps'}
                                />
                            )}
                        />

                        <Route
                            exact
                            path="/users/category/:category/dish/:dishId"
                            render={props => (
                                <DishEntry
                                    {...props}
                                    userID={app.auth().currentUser.uid}
                                />
                            )}
                        />

                        <Route
                            exact
                            path="/users/category/:category"
                            render={props => (
                                <DishListTable
                                    {...props}
                                    userID={app.auth().currentUser.uid}
                                    loading={true}
                                />
                            )}
                        />
                    </Switch>
                </div>
            </Router>
        );
    }
}

export default App;
