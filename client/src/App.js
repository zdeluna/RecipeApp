import React, {Component} from 'react';
import {Route, Switch} from 'react-router';
import {BrowserRouter as Router} from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import app from './base';

import Home from './containers/HomePage/Home';
import LogIn from './containers/LogIn';
import SignUp from './containers/SignUp';
import DishListTable from './containers/DishListPage/DishListTable';
import DishEntry from './containers/DishEntryPage/DishEntry';
import ItemForm from './components/ItemForm';

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
                            render={props => (
                                <ItemForm {...props} type={'ingredients'} />
                            )}
                        />
                        <Route
                            exact
                            path="/users/category/:category/dish/:dishId/steps"
                            render={props => (
                                <ItemForm {...props} type={'steps'} />
                            )}
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
