import React, { Fragment, useState, useRef } from "react";
import { Button, Input } from "reactstrap";
import "./Notes.css";
import { UPDATE_DISH } from "../api/mutations/dish/updateDish";
import { GET_DISH } from "../api/queries/dish/getDish";
import { useMutation, useQuery } from "@apollo/react-hooks";
import { useInput } from "../hooks/useInput";

const Notes = props => {
    const [dishId] = useState(props.dishId);
    const [isEditing, setEditing] = useState(false);

    const [notes, setNotes, notesInput] = useInput({
        type: "text",
        initialValue: props.notes
    });
    useQuery(GET_DISH, {
        variables: {
            dishId: dishId
        },
        onCompleted({ dish }) {
            if (dish.notes) {
                setNotes(dish.notes);
            }
        }
    });

    const [updateDish] = useMutation(UPDATE_DISH);

    const addNotesToDatabase = async () => {
        setEditing(false);

        updateDish({
            variables: {
                dishId: dishId,
                notes: notes
            }
        });
    };

    const setEditMode = event => {
        setEditing(true);
    };

    if (isEditing) {
        return (
            <Fragment>
                <Button color="primary" size="md" onClick={addNotesToDatabase}>
                    Save Notes
                </Button>
                {notesInput}
            </Fragment>
        );
    } else {
        return (
            <Fragment>
                <Button color="primary" size="md" onClick={setEditMode}>
                    Edit Notes
                </Button>
                <div id="notesText">
                    <p>{notes}</p>
                </div>
            </Fragment>
        );
    }
};
export default Notes;
