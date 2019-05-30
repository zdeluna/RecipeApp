import React, {Component} from 'react';
import {Link, withRouter, Redirect} from 'react-router-dom';
import AddDishForm from '../../components/AddDishForm';
import {Table, Container, Row} from 'reactstrap';
import './DishListTable.css';
import API from '../../utils/Api';
import Loading from '../../components/Loading';

class DishListTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userID: this.props.userID, //app.auth().currentUser,
            dishes: [],
            category: this.props.match.params.category,
            redirect: false,
            loading: this.props.loading,
        };
        this.handleClick = this.handleClick.bind(this);
    }

    componentWillUnmount() {
        this.setState({dishes: null, loaded: false});
    }

    componentDidMount = async () => {
        if (!this.state.dishes || this.state.dishes.length === 0)
            await this.getDishes();
        else {
            this.setState({dishes: this.props.dishes, loading: false});
        }
    };

    getDishes = async () => {
        var api = new API();
        api.getDishesOfUser(this.state.userID).then(response => {
            if (response.status === 200) {
                if (response.data) {
                    let dishes = response.data;
                    let dishArray = [];
                    let newDish;
                    for (let dish in dishes) {
                        // If the dish category parameter matches the url query then add it to the array
                        if (dishes[dish].category === this.state.category) {
                            newDish = {
                                id: dish,
                                name: dishes[dish].name,
                                history: dishes[dish].history,
                                cookingTime: dishes[dish].cookingTime,
                            };

                            if (dishes[dish].history) {
                                newDish.lastMade = dishes[dish].history[0];
                            }

                            dishArray.push(newDish);
                        }
                    }

                    this.setState({
                        dishes: dishArray,
                    });
                }
            }
            this.setState({
                loading: false,
            });
        });
    };

    handleClick(id) {
        // Redirect to the dish entry page using the id that was recently created
        this.setState({dishId: id});
        var redirect_url =
            '/users/category/' +
            this.state.category +
            '/dish/' +
            this.state.dishId;
        <Redirect push to="redirect_url" />;
    }

    renderTable = props => {
        if (props.loading) return <Loading />;
        else
            return (
                <div>
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
                                <tr className="dishRow" key={dish.id + 'r'}>
                                    <td key={dish.id + 'name'}>
                                        <Link
                                            className="dishLink"
                                            key={dish.id + 'link'}
                                            to={`/users/category/${
                                                this.state.category
                                            }/dish/${dish.id}`}>
                                            {dish.name}
                                        </Link>
                                    </td>
                                    <td key={dish.id + 'time'}>
                                        {dish.cookingTime}
                                    </td>
                                    <td key={dish.id + 'date'}>
                                        {dish.lastMade}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            );
    };

    render() {
        return (
            <Container>
                <Row>
                    {' '}
                    <Link to={`/`} id="goBackLink">
                        Go Back To Categories
                    </Link>
                </Row>
                <Row>
                    <AddDishForm
                        category={this.state.category}
                        onClick={id => this.handleClick(id)}
                    />
                </Row>
                <this.renderTable loading={this.state.loading} />
            </Container>
        );
    }
}

export default DishListTable;
