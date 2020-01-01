import React, {Component} from 'react';
import {Route, Switch} from 'react-router';
import {BrowserRouter as Router} from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import app from './base';

import Category from './containers/CategoriesPage/Category';
import LogIn from './containers/LogInPage/LogIn';
import Home from './containers/HomePage/Home';
import SignUp from './containers/SignUpPage/SignUp';
import DishListTable from './containers/DishListPage/DishListTable';
import DishEntry from './containers/DishEntryPage/DishEntry';
import RecipeGuide from './containers/DishEntryPage/RecipeGuide';
import ItemForm from './components/ItemForm';
import './App.css';

class App extends Component {
    state = {loading: true, authenticated: false, user: {uid: ''}};

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
                    currentUser: {uid: ''},
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
                            userID={this.state.currentUser.uid}
                            loading={true}
                        />
                        )} />
                        <PrivateRoute
                            exact
                            path="/users/category/:category/dish/:dishId/ingredients"
                            component={ItemForm}
                            authenticated={authenticated}
                            userId={this.state.currentUser.uid}
                            update={true}
                            type={'ingredients'}
                        />
                        )} />
                        <PrivateRoute
                            exact
                            path="/users/category/:category/dish/:dishId/steps"
                            component={ItemForm}
                            authenticated={authenticated}
                            userId={this.state.currentUser.uid}
                            update={true}
                            type={'steps'}
                        />
                        )} />
                        <PrivateRoute
                            exact
                            path="/users/category/:category/dish/:dishId"
                            component={DishEntry}
                            authenticated={authenticated}
                            userId={this.state.currentUser.uid}
                        />
                        )} />
                        <PrivateRoute
                            exact
                            path="/users/category/:category"
                            component={DishListTable}
                            authenticated={authenticated}
                            userID={this.state.currentUser.uid}
                            loading={true}
                        />
                        )} />
                    </Switch>
                </div>
            </Router>
        );
    }
}

export default App;
