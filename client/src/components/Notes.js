import React, { useState, useRef } from "react";
import { Button, Input } from "reactstrap";
import "./Notes.css";
import { UPDATE_DISH } from "../api/mutations/dish/updateDish";
import { GET_DISH } from "../api/queries/dish/getDish";
import { useMutation, useQuery } from "@apollo/react-hooks";

const Notes = props => {
    const [userId] = useState(props.userId);
    const [dishId] = useState(props.dishId);
    const [notes, setNotes] = useState(props.notes);
    const [fieldCreated, setFieldCreated] = notes
        ? useState(true)
        : useState(false);
    const [isEditing, setEditing] = useState(false);

    const inputEl = useRef(null);

    useQuery(GET_DISH, {
        variables: {
            dishId: dishId
        },
        onCompleted({ dish }) {
            if (dish.notes) {
                setNotes(dish.notes);
                setFieldCreated(true);
            }
        }
    });

    const [updateDish] = useMutation(UPDATE_DISH);

    const fieldChanged = event => {
        setEditing(true);
        setNotes(event.target.value);
    };

    const createField = () => {
        setFieldCreated(true);
        setEditing(true);
    };

    const addNotesToDatabase = async () => {
        setEditing(false);
        setFieldCreated(true);

        updateDish({
            variables: {
                dishId: dishId,
                notes: notes
            }
        });
    };

    const setEditMode = event => {
        console.log(inputEl);
        setEditing(true);
    };

    /* Render the components based on if the user has already sheduled the dish today*/
    const RenderComponents = () => {
        if (!fieldCreated)
            return (
                <div>
                    <Button color="primary" size="md" onClick={createField}>
                        Add Notes
                    </Button>
                </div>
            );

        if (isEditing)
            return (
                <div>
                    <Input
                        id="notesTextArea"
                        onChange={fieldChanged}
                        value={notes}
                        ref={inputEl}
                        type="text"
                        autoFocus
                    />{" "}
                    <Button
                        color="primary"
                        size="md"
                        onClick={addNotesToDatabase}
                    >
                        Save Notes
                    </Button>
                </div>
            );
        else
            return (
                <div>
                    <Button color="primary" size="md" onClick={setEditMode}>
                        Edit Notes
                    </Button>
                    <div id="notesText">
                        <p>{notes}</p>
                    </div>
                </div>
            );
    };

    return <RenderComponents />;
};
export default Notes;
