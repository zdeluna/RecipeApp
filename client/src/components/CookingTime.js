import React, { Fragment, useState, useRef } from "react";
import { Button, Input } from "reactstrap";
import "./Notes.css";
import { UPDATE_DISH } from "../api/mutations/dish/updateDish";
import { GET_DISH } from "../api/queries/dish/getDish";
import { useMutation, useQuery } from "@apollo/react-hooks";
import { useInput } from "../hooks/useInput";

const CookingTime = props => {
    const [dishId] = useState(props.dishId);
    const [isEditing, setEditing] = useState(false);

    const [cookingTime, setCookingTime, notesInput] = useInput({
        type: "text",
        initialValue: props.cookingTime
    });
    useQuery(GET_DISH, {
        variables: {
            dishId: dishId
        },
        onCompleted({ dish }) {
            if (dish.cookingTime) {
                setCookingTime(dish.cookingTime);
            }
        }
    });

    const [updateDish] = useMutation(UPDATE_DISH);

    const addCookingTimeToDatabase = async () => {
        setEditing(false);

        updateDish({
            variables: {
                dishId: dishId,
                cookingTime: cookingTime
            }
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
