import React, {useState, useEffect, useRef} from 'react';
import {Button, Input} from 'reactstrap';
import './Notes.css';
import Textarea from 'react-textarea-autosize';
import DataField from './DataField';
import {useApolloClient} from '@apollo/react-hooks';
import {UPDATE_DISH} from '../api/mutations/dish/updateDish';
import {GET_DISH} from '../api/queries/dish/getDish';
import {useMutation, useQuery} from '@apollo/react-hooks';

const CookingTime = props => {
    const [userId, setUserId] = useState(props.userId);
    const [dishId, setDishId] = useState(props.dishId);
    const [cookingTime, setCookingTime] = useState(props.cookingTime);
    const [fieldCreated, setFieldCreated] = cookingTime
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
            if (dish.cookingTime) setCookingTime(dish.cookingTime);
        },
    });

    const [updateDish, {data}] = useMutation(UPDATE_DISH, {
        onCompleted(updateDishResponse) {},
    });

    const fieldChanged = event => {
        setEditing(true);

        setCookingTime(event.target.value);
    };

    const createField = () => {
        setFieldCreated(true);
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
                    <input
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
