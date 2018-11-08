import React, {Component} from 'react';
import {Route, Redirect, BrowserRouter, Link} from 'react-router-dom';
import app from './base';
import AddDishForm from './AddDishForm';
import ViewDishButton from './ViewDishButton';
import {Table, Container, Row} from 'reactstrap';
import './DishListTable.css';

class DishListTable extends Component {
    constructor() {
        super();
        this.state = {
            user: app.auth().currentUser,
            dishes: [],
            category: 1, //this.props.match.params.category,
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

            for (let dish in dishes) {
                // If the dish category parameter matches the url query then add it to the array
                if (dishes[dish].category == this.state.category) {
                    dishArray.push({
                        id: dish,
                        name: dishes[dish].name,
                    });
                }
            }
            console.log('print dish array');
            console.log(dishArray);
            this.setState({
                dishes: dishArray,
                loaded: true,
            });
        });
    }

    componentWillUnmount() {
        this.dishesRef.off();
    }

    handleClick = (e, id) => {
        console.log('Go to dish');
    };

    render() {
        return (
            <Container>
                <Row>
                    <AddDishForm />
                </Row>
                <Table className="dishTable">
                    <thead>
                        <tr>
                            <th>Dish</th>
                            <th>Time to Make</th>
                            <th>Last made</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.dishes.map(dish => (
                            <tr>
                                <td key={dish.id}>
                                    <Link
                                        key={dish.id}
                                        to={`/users/category/${
                                            this.state.category
                                        }/dish/${dish.id}`}>
                                        {dish.name}
                                    </Link>
                                </td>
                                <td key={dish.id}>40 minutes</td>
                                <td key={dish.id}>1/1/2018</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Container>
        );
    }
}

export default DishListTable;
