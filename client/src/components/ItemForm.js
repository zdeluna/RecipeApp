//@format

import React, {useState} from 'react';
import {Redirect} from 'react-router-dom';
import app from '../base';
import Item from './Item';
import {Form, Button, FormGroup, Container, Col, Row} from 'reactstrap';
import API from '../utils/Api';
import './ItemForm.css';
import {UPDATE_DISH} from '../api/mutations/dish/updateDish';
import {useMutation} from '@apollo/react-hooks';
import {useApolloClient} from '@apollo/react-hooks';

const ItemForm = props => {
    const client = useApolloClient();
    const [userId, setUserId] = useState(props.userId);
    const [dishId, setDishId] = useState(props.dishId);
    const [type, setType] = useState(props.type);
    const [update, setUpdate] = useState(false);
    const [itemsArray, setItemsArray] = useState([{value: '', visible: false}]);

    const [updateDish, {data}] = useMutation(UPDATE_DISH, {
        onCompleted(updateDishResponse) {
            props.onClick();
        },
    });

    const addItemsToDatabase = async () => {
        // Only store the value fields from itemsArray.
        let itemsData = itemsArray.map(function(item) {
            return {
                value: item.value,
            };
        });
        console.log({
            userId: userId,
            dishId: dishId,
            [type]: itemsData,
        });
        updateDish({
            variables: {
                userId: userId,
                dishId: dishId,
                [type]: itemsData,
            },
        });
    };

    const addItem = event => {
        // Concatenate an array with stepForms that includes the new step
        let newItemsArray = itemsArray.concat({
            value: '',
            visible: true,
        });
        setItemsArray(newItemsArray);
    };

    const handleChange = (index, value) => {
        let newItemsArray = itemsArray;
        newItemsArray[index].value = value;
        setItemsArray(newItemsArray);
    };

    const handleSubmit = event => {
        event.preventDefault();
        addItemsToDatabase();
    };

    const handleDeleteItem = index => {
        console.log('delete: ' + index);
        let newItemsArray = removeItem(index);
        console.log(newItemsArray);

        /*
        // Set the visible property of the new last step's delete button as true if the
        // user is adding steps/ingredients for the first time
        if (!update) {
            newItemsArray[newItemsArray.length - 1]['visible'] = false;

            if (newItemsArray.length > 1)
                newItemsArray[newItemsArray.length - 1]['visible'] = true;
}*/
        setItemsArray(newItemsArray);
    };

    const removeItem = index => {
        return itemsArray.filter((_, i) => i !== index);
    };

    return (
        <Container>
            <Row>
                <Col lg={{size: 8, offset: 2}}>
                    <Form>
                        {itemsArray.map((item, index) => (
                            <FormGroup key={'ItemFormGroup' + index}>
                                <Item
                                    key={new Date().getTime() + index}
                                    id={index}
                                    value={item.value}
                                    onChange={handleChange}
                                    onClick={index => handleDeleteItem(index)}
                                    onBlur={handleChange}
                                    deleteButton={item.visible}
                                    type={type}
                                />
                            </FormGroup>
                        ))}
                        <FormGroup>
                            <Button
                                className="formButtons"
                                color="primary"
                                onClick={addItem}>
                                Add
                            </Button>
                            <Button
                                color="primary"
                                onClick={event => handleSubmit(event)}>
                                Save
                            </Button>
                        </FormGroup>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};
export default ItemForm;
