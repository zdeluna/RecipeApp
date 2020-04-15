import React, { useState } from "react";
import { Link } from "react-router-dom";
import AddDishForm from "../../components/AddDishForm";
import { Table, Container, Row } from "reactstrap";
import "./DishListTable.css";
import Loading from "../../components/Loading";
import { useQuery } from "@apollo/react-hooks";
import { GET_DISHES } from "../../api/queries/dish/getAllDishes";
import app from "../../base";

const DishListTable = props => {
    const [userId] = useState(props.userId);
    const [category] = useState(props.match.params.category);
    const [dishes, setDishes] = useState([]);
    const { loading, error } = useQuery(GET_DISHES, {
        onCompleted({ dishes }) {
            if (dishes) setDishes(dishes);
        }
    });

    if (loading) return <Loading />;
    if (error) return <p>Error :(</p>;

    const handleClick = dishId => {
        props.history.push(`/users/category/${category}/dish/${dishId}`);
    };

    const ShowTableRows = () => {
        return dishes.map(dish => (
            <tr className="dishRow" key={dish.id + "r"}>
                <td key={dish.id + "name"}>
                    <Link
                        className="dishLink"
                        key={dish.id + "link"}
                        to={`/users/category/${dish.category}/dish/${dish.id}`}
                    >
                        {dish.name}
                    </Link>
                </td>
                <td key={dish.id + "time"}>{dish.cookingTime}</td>
                <td key={dish.id + "date"}>{dish.lastMade}</td>
            </tr>
        ));
    };

    const RenderTable = () => {
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
                        <ShowTableRows />
                    </tbody>
                </Table>
            </div>
        );
    };

    return (
        <Container>
            <Row>
                {" "}
                <Link to={`/`} id="goBackLink">
                    Go Back To Categories
                </Link>
            </Row>
            <Row>
                <AddDishForm
                    category={category}
                    onClick={id => handleClick(id)}
                    userId={userId}
                />
            </Row>

            <RenderTable />
        </Container>
    );
};

export default DishListTable;
