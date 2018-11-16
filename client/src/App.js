import React, {Component} from 'react';
import {Route, Switch} from 'react-router';
import {BrowserRouter as Router} from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import app from './base';

import Home from './Home';
import LogIn from './LogIn';
import SignUp from './SignUp';
import DishListTable from './DishListTable';
import DishEntry from './DishEntry';
import RecipeStepsForm from './RecipeStepsForm';

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
                            path="/"
                            component={Home}
                            authenticated={authenticated}
                        />
                        <Route exact path="/login" component={LogIn} />
                        <Route exact path="/signup" component={SignUp} />
                        <Route
                            exact
                            path="/users/category/:category/dish/:dishId/ingredients"
                            component={RecipeStepsForm}
                        />
                        <Route
                            exact
                            path="/users/category/:category/dish/:dishId"
                            component={DishEntry}
                        />

                        <Route
                            exact
                            path="/users/category/:category"
                            component={DishListTable}
                        />
                    </Switch>
                </div>
            </Router>
        );
    }
}

export default App;
