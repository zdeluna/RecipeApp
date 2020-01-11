import React, {useState, useRef} from 'react';
import {Button, Input} from 'reactstrap';
import './Notes.css';
import {UPDATE_DISH} from '../api/mutations/dish/updateDish';
import {GET_DISH} from '../api/queries/dish/getDish';
import {useMutation, useQuery} from '@apollo/react-hooks';

const CookingTime = props => {
    const [userId] = useState(props.userId);
    const [dishId] = useState(props.dishId);
    const [cookingTime, setCookingTime] = useState(props.cookingTime);
    const [fieldCreated, setFieldCreated] = cookingTime
        ? useState(true)
        : useState(false);
    const [isEditing, setEditing] = useState(false);

    const inputEl = useRef(null);

    useQuery(GET_DISH, {
        variables: {
            userId: userId,
            dishId: dishId,
        },
        onCompleted({dish}) {
            if (dish.cookingTime) {
                setCookingTime(dish.cookingTime);
                setFieldCreated(true);
            }
        },
    });

    const [updateDish] = useMutation(UPDATE_DISH);

    const fieldChanged = event => {
        setEditing(true);

        setCookingTime(event.target.value);
    };

    const createField = () => {
        setFieldCreated(true);
        setEditing(true);
    };

    const addCookingTimeToDatabase = async () => {
        setEditing(false);
        setFieldCreated(true);

        updateDish({
            variables: {
                userId: userId,
                dishId: dishId,
                cookingTime: cookingTime,
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
                        Add Cooking Time
                    </Button>
                </div>
            );

        if (isEditing)
            return (
                <div>
                    <Input
                        id="notesTextArea"
                        onChange={fieldChanged}
                        value={cookingTime}
                        ref={inputEl}
                        type="text"
                        autoFocus
                    />{' '}
                    <Button
                        color="primary"
                        size="md"
                        onClick={addCookingTimeToDatabase}>
                        Save Cooking Time
                    </Button>
                </div>
            );
        else
            return (
                <div>
                    <Button color="primary" size="md" onClick={setEditMode}>
                        Edit Cooking Time
                    </Button>
                    <div id="notesText">
                        <p>{cookingTime}</p>
                    </div>
                </div>
            );
    };

    return <RenderComponents />;
};
export default CookingTime;
