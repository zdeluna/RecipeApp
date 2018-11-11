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
        console.log('In dish: ' + id);
    };

    render() {
        return (
            <Container>
                <Row>
                    <AddDishForm onClick={id => this.handleClick(id)} />
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
                                <td key={dish.id + 'date'}>1/1/2018</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Container>
        );
    }
}

export default DishListTable;
