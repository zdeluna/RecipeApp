import React, {Component} from 'react';
import {Route, Redirect, BrowserRouter, Link} from 'react-router-dom';
import app from './base';
import AddDishForm from './AddDishForm';
import {Table, Container, Row} from 'reactstrap';
import './DishListTable.css';

class DishListTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: app.auth().currentUser,
            dishes: [],
            category: this.props.match.params.category,
            redirect: false,
            loaded: false,
        };
    }
    componentDidMount() {
        this.dishesRef = app
            .database()
            .ref()
            .child('dishes')
            .child(this.state.user.uid);

        this.dishesRef.on('value', snapshot => {
            let dishes = snapshot.val();
            let dishArray = [];
            let newDish;
            for (let dish in dishes) {
                // If the dish category parameter matches the url query then add it to the array
                if (dishes[dish].category == this.state.category) {
                    newDish = {
                        id: dish,
                        name: dishes[dish].name,
                        history: dishes[dish].history,
                    };

                    if (dishes[dish].history) {
                        newDish.lastMade = dishes[dish].history[0];
                    }

                    dishArray.push(newDish);
                }
            }
            this.setState({
                dishes: dishArray,
                loaded: true,
            });
        });
    }

    componentWillUnmount() {
        this.dishesRef.off();
    }

    handleClick = id => {
        // Redirect to the dish entry page using the id that was recently created
        this.setState({dishId: id});
        var redirect_location =
            '/users/category/' +
            this.state.category +
            '/dish/' +
            this.state.dishId;

        this.props.history.push(redirect_location);
    };

    render() {
        return (
            <Container>
                <Row>
                    <AddDishForm
                        category={this.state.category}
                        onClick={id => this.handleClick(id)}
                    />
                </Row>
                <Table striped className="dishTable">
                    <thead>
                        <tr>
                            <th>Dish</th>
                            <th>Time to Make</th>
                            <th>Last made</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.dishes.map(dish => (
                            <tr key={dish.id + 'r'}>
                                <td key={dish.id + 'c'}>
                                    <Link
                                        key={dish.id + 'link'}
                                        to={`/users/category/${
                                            this.state.category
                                        }/dish/${dish.id}`}>
                                        {dish.name}
                                    </Link>
                                </td>
                                <td key={dish.id + 'time'}>40 minutes</td>
                                <td key={dish.id + 'date'}>{dish.lastMade}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Container>
        );
    }
}

export default DishListTable;
