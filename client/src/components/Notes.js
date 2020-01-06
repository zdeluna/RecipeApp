import React, {useState, useEffect, useRef} from 'react';
import {Button, Input} from 'reactstrap';
import './Notes.css';
import Textarea from 'react-textarea-autosize';
import DataField from './DataField';
import {useApolloClient} from '@apollo/react-hooks';
import {UPDATE_DISH} from '../api/mutations/dish/updateDish';
import {GET_DISH} from '../api/queries/dish/getDish';
import {useMutation, useQuery} from '@apollo/react-hooks';

const Notes = props => {
    const [userId, setUserId] = useState(props.userId);
    const [dishId, setDishId] = useState(props.dishId);
    const [notes, setNotes] = useState(props.notes);
    const [fieldCreated, setFieldCreated] = notes
        ? useState(true)
        : useState(false);
    const client = useApolloClient();
    const [isEditing, setEditing] = useState(false);

    const toggleEditing = () => {
        setEditing(!isEditing);
        console.log('toggle');
    };

    const inputEl = useRef(null);

    useEffect(
        () => {
            if (isEditing) {
                console.log(inputEl.current);
                console.log('focus');
                //inputEl.current.focus();
            } else {
                console.log('unfocus');
            }
        },
        [isEditing],
    );

    const {loading, error, dishData} = useQuery(GET_DISH, {
        variables: {
            userId: userId,
            dishId: dishId,
        },
        onCompleted({dish}) {
            if (dish.notes) setNotes(dish.notes);
        },
    });

    const [updateDish, {data}] = useMutation(UPDATE_DISH, {
        onCompleted(updateDishResponse) {},
    });

    const fieldChanged = event => {
        setEditing(true);

        setNotes(event.target.value);
    };

    const createField = () => {
        setFieldCreated(true);
    };

    const addNotesToDatabase = async () => {
        setEditing(false);
        setFieldCreated(true);

        updateDish({
            variables: {
                userId: userId,
                dishId: dishId,
                notes: notes,
            },
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
                    <input
                        id="notesTextArea"
                        onChange={fieldChanged}
                        value={notes}
                        ref={inputEl}
                        type="text"
                        autoFocus
                    />{' '}
                    <Button
                        color="primary"
                        size="md"
                        onClick={addNotesToDatabase}>
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
