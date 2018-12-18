//@format

import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';
import app from '../base';
import Item from './Item';
import {Form, Button, FormGroup, Container, Col, Row} from 'reactstrap';
import API from '../utils/Api';

class ItemForm extends Component {
    constructor(props) {
        super(props);

        this.dishId = 0;

        if (this.props.update === true) {
            this.dishId = this.props.match.params.dishId;
        } else this.dishId = this.props.dishId;

        this.state = {
            value: '',
            user: app.auth().currentUser,
            type: this.props.type,
            numberOfItems: 4,
            itemsArray: [
                {id: 0, value: '', visible: false},
                {id: 1, value: '', visible: false},
                {id: 2, value: '', visible: false},
                {id: 3, value: '', visible: true},
            ],
            update: false,
            dishId: this.dishId,
            redirect: false,
        };
        if (this.state.type === 'ingredients') {
            this.addButtonText = 'Add Ingredient';
        } else {
            this.addButtonText = 'Add Step';
        }
    }

    // Check to see if the ingredients have already been stored in the database
    // by making a get request to the api then update the ingredients array in state
    componentDidMount() {
        const api = new API();
        api.getDish(this.state.user.uid, this.state.dishId).then(response => {
            if (response.status === 200) {
                if (
                    this.props.type === 'ingredients' &&
                    response.data.ingredients
                ) {
                    this.setState({
                        update: true,
                        itemsArray: response.data.ingredients,
                    });
                } else if (this.props.type === 'steps' && response.data.steps) {
                    this.setState({
                        update: true,
                        itemsArray: response.data.steps,
                    });
                }
            }
        });
    }

    addItemsToDatabase = async () => {
        // Only send id and value fields from the stepForms array.
        // Create a new array "stepsData" to have the filtered properties
        var itemsData = this.state.itemsArray.map(function(item) {
            return {
                id: item.id,
                value: item.value,
            };
        });

        const api = new API();

        let itemsField = {[this.state.type]: itemsData};
        api.updateDish(this.state.user.uid, this.props.dishId, itemsField)
            .then(response => {
                this.props.onClick();
                //this.state.update this.setState({redirect: true});
            })
            .catch(error => {
                console.log(error.response);
            });
    };

    addItem = event => {
        // Set the last object of step forms to have a visible property of false

        // Increase the number of steps listed in the state property
        let newItemsArray = this.state.itemsArray;
        newItemsArray[this.state.numberOfItems - 1]['visible'] = false;

        let numItems = this.state.numberOfItems + 1;

        this.setState({itemsArray: newItemsArray, numberOfItems: numItems});

        // https://stackoverflow.com/questions/23966438/what-is-the-preferred-way-to-mutate-a-react-state
        // Concatenate an array with stepForms that includes the new step
        this.setState(state => ({
            itemsArray: state.itemsArray.concat({
                id: this.state.numberOfItems,
                value: '',
                visible: true,
            }),
        }));
    };

    handleChange = (id, value) => {
        let newItemsArray = this.state.itemsArray;
        newItemsArray[id].value = value;

        this.setState({itemsArray: newItemsArray});
    };

    handleSubmit = event => {
        event.preventDefault();
        this.addItemsToDatabase();
    };

    handleDeleteItem = id => {
        this.removeItem(id - 1);

        // Increase the number of steps listed in the state property
        let newItemsArray = this.state.itemsArray;
        newItemsArray[this.state.numberOfItems - 1]['visible'] = false;

        let numItems = this.state.numberOfItems - 1;
        // Set the visible property of the new last step's delete button as true
        if (this.state.numberOfItems > 1)
            newItemsArray[this.state.numberOfItems - 1]['visible'] = true;

        this.setState({itemsArray: newItemsArray, numberOfItems: numItems});
    };

    // https://stackoverflow.com/questions/29527385/removing-element-from-array-in-component-state

    removeItem(id) {
        // Remove the last step object from the stepForms array
        this.setState({
            itemsArray: this.state.itemsArray.filter((_, i) => i !== id),
        });
    }

    render() {
        if (this.state.redirect) {
            return (
                <Redirect
                    push
                    to={`/users/category/${
                        this.props.match.params.category
                    }/dish/${this.state.dishId}`}
                />
            );
        }

        return (
            <Container>
                <Row>
                    <Col sm="12" md={{size: 6, order: 1, offset: 4}}>
                        <Form>
                            {this.state.itemsArray.map(item => (
                                <FormGroup>
                                    <Item
                                        key={item.id}
                                        value={item.value}
                                        id={item.id}
                                        onChange={this.handleChange}
                                        onClick={this.handleDeleteItem}
                                        onBlur={this.handleChange}
                                        deleteButton={item.visible}
                                        type={this.state.type}
                                    />
                                </FormGroup>
                            ))}
                            <FormGroup>
                                <Button color="primary" onClick={this.addItem}>
                                    {this.addButtonText}
                                </Button>
                                <Button
                                    color="primary"
                                    onClick={event => this.handleSubmit(event)}>
                                    Save
                                </Button>
                            </FormGroup>
                        </Form>
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default ItemForm;
