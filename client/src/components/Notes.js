import React, { Fragment, useState, useRef } from "react";
import { Button, Input } from "reactstrap";
import "./Notes.css";
import { UPDATE_PARTIAL_DISH } from "../api/mutations/dish/updateDish";
import { GET_DISH } from "../api/queries/dish/getDish";
import { useMutation, useQuery } from "@apollo/react-hooks";
import { useInput } from "../hooks/useInput";
import { useApolloClient } from "@apollo/react-hooks";

const Notes = props => {
    const [dishId] = useState(props.dishId);
    const [isEditing, setEditing] = useState(false);
    const [dish, setDish] = useState("");
    const client = useApolloClient();

    const [notes, setNotes, notesInput] = useInput({
        type: "text",
        initialValue: props.notes
    });

    useQuery(GET_DISH, {
        variables: {
            id: dishId
        },
        onCompleted({ dish }) {
            if (dish.notes) {
                setNotes(dish.notes);
            }
            setDish(dish);
        }
    });

    const [updatePartialDish] = useMutation(UPDATE_PARTIAL_DISH);

    const addNotesToDatabase = async () => {
        setEditing(false);

        updatePartialDish({
            variables: {
                id: dishId,
                notes: notes
            }
        });

        let data = client.readQuery({
            query: GET_DISH,
            variables: { id: dishId }
        });

        data.dish.notes = notes;

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
