import React, {Component} from 'react';
import {Link, Redirect} from 'react-router-dom';
import AddDishForm from '../../components/AddDishForm';
import {Table, Container, Row} from 'reactstrap';
import './DishListTable.css';
import API from '../../utils/Api';
import Loading from '../../components/Loading';
import gql from 'graphql-tag';
import {useQuery} from '@apollo/react-hooks';

const GET_DISHES = gql`
    query getDishes($userId: String!) {
        dishes(userId: $userId) {
            id
            name
            cookingTime
            category
        }
    }
`;

function ShowTable(props) {
    console.log('user id is: ' + props.uid);
    const {loading, error, data} = useQuery(GET_DISHES, {
        variables: {userId: props.uid},
    });

    if (loading)
        return (
            <tr>
                <p>Loading...</p>
            </tr>
        );
    if (error)
        return (
            <tr>
                <p>Error :(</p>
            </tr>
        );

    return data.dishes.map(dish => (
        <tr className="dishRow" key={dish.id + 'r'}>
            <td key={dish.id + 'name'}>
                <Link
                    className="dishLink"
                    key={dish.id + 'link'}
                    to={`/users/category/${dish.category}/dish/${dish.id}`}>
                    {dish.name}
                </Link>
            </td>
            <td key={dish.id + 'time'}>{dish.cookingTime}</td>
            <td key={dish.id + 'date'}>{dish.lastMade}</td>
        </tr>
    ));
}

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

    handleClick(id) {
        // Redirect to the dish entry page using the id that was recently created
        this.setState({dishId: id, redirect: true});
    }

    renderTable = () => {
        if (this.state.redirect) {
            var redirect_url =
                '/users/category/' +
                this.state.category +
                '/dish/' +
                this.state.dishId;
            return <Redirect push to={redirect_url} />;
        } else
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
                            <ShowTable uid={this.state.userID} />
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
                        uid={this.state.userID}
                    />
                </Row>

                <this.renderTable />
            </Container>
        );
    }
}

export default DishListTable;
