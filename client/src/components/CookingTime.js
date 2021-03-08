import React, { Fragment, useState, useRef } from "react";
import { Button, Input } from "reactstrap";
import "./Notes.css";
import { UPDATE_PARTIAL_DISH } from "../api/mutations/dish/updateDish";
import { GET_DISH } from "../api/queries/dish/getDish";
import { useMutation, useQuery } from "@apollo/react-hooks";
import { useInput } from "../hooks/useInput";
import { useApolloClient } from "@apollo/react-hooks";

const CookingTime = props => {
    const [dishId] = useState(props.dishId);
    const [isEditing, setEditing] = useState(false);
    const [dish, setDish] = useState("");
    const [cookingTime, setCookingTime, notesInput] = useInput({
        type: "text",
        initialValue: props.cookingTime
    });
    const client = useApolloClient();

    useQuery(GET_DISH, {
        variables: {
            id: dishId
        },
        onCompleted({ dish }) {
            if (dish.cookingTime) {
                setCookingTime(dish.cookingTime);
            }
            setDish(dish);
        }
    });

    const [updatePartialDish] = useMutation(UPDATE_PARTIAL_DISH);

    const addCookingTimeToDatabase = async () => {
        setEditing(false);

        updatePartialDish({
            variables: {
                id: dishId,
                cookingTime: cookingTime
            }
        });

        let data = client.readQuery({
            query: GET_DISH,
            variables: { id: dishId }
        });

        data.dish.cookingTime = cookingTime;

        client.writeQuery({
            query: GET_DISH,
            variables: { id: dishId },
            data: { dish: data.dish }
        });
    };

    const setEditMode = event => {
        setEditing(true);
    };

    if (isEditing) {
        return (
            <Fragment>
                <Button
                    color="primary"
                    size="md"
                    onClick={addCookingTimeToDatabase}
                >
                    Save Cooking Time
                </Button>
                {notesInput}
            </Fragment>
        );
    } else {
        return (
            <Fragment>
                <Button color="primary" size="md" onClick={setEditMode}>
                    Edit Cooking Time
                </Button>
                <div id="notesText">
                    <p>{cookingTime}</p>
                </div>
            </Fragment>
        );
    }
};
export default CookingTime;
