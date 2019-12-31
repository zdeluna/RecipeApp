//@format

import React, {useState, useEffect, useRef} from 'react';
import {Redirect} from 'react-router-dom';
import app from '../base';
import Item from './Item';
import {Form, Button, FormGroup, Container, Col, Row} from 'reactstrap';
import './ItemForm.css';

const ItemForm = props => {
    console.log('ITEM FORM');
    const [userId, setUserId] = useState(props.userId);
    const [dishId, setDishId] = useState(props.dishId);
    const [type, setType] = useState(props.type);
    const [update, setUpdate] = useState(false);
    const [isMounted, setMounted] = useState(false);
    const [itemsArray, setItemsArray] = useState([{value: '', visible: false}]);

    const ref = useRef(false);
    useEffect(() => {
        ref.current = true;
        return () => {
            ref.current = false;
        };
    }, []);

    const addItemsToDatabase = () => {
        console.log('USER: ' + userId);
        // Only store the value fields from itemsArray.
        let itemsData = itemsArray.map(function(item) {
            return {
                value: item.value,
            };
        });
        props.onClick(itemsData);
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
        console.log('Submit form');
        event.preventDefault();
        addItemsToDatabase();
    };

    const handleDeleteItem = index => {
        console.log('delete: ' + index);
        let newItemsArray = removeItem(index);
        console.log(newItemsArray);

        setItemsArray(newItemsArray);
    };

    const removeItem = index => {
        return itemsArray.filter((_, i) => i !== index);
    };

    return (
        <Container>
            <Row>
                <Col lg={{size: 8, offset: 2}}>
                    <Form onSubmit={handleSubmit}>
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
                            <Button color="primary">Save</Button>
                        </FormGroup>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};
export default ItemForm;
