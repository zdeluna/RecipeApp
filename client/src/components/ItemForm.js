//@format

import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';
import app from '../base';
import Item from './Item';
import {Form, Button, FormGroup, Container, Col, Row} from 'reactstrap';
import API from '../utils/Api';
import './ItemForm.css';

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
            itemsArray: [{id: 0, value: '', visible: false}],
            update: false,
            dishId: this.dishId,
            redirect: false,
            loading: true,
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

                var updatedItemsArray = this.state.itemsArray;

                for (var i = 0; i < updatedItemsArray.length; i++) {
                    updatedItemsArray[i].visible = true;
                }

                this.setState({itemsArray: updatedItemsArray, loading: false});
            }
        });
    }

    addItemsToDatabase = async () => {
        // Only store the value fields from itemsArray.
        var itemsData = this.state.itemsArray.map(function(item) {
            return {
                value: item.value,
            };
        });

        const api = new API();

        let itemsField = {[this.state.type]: itemsData};
        api.updateDish(this.state.user.uid, this.dishId, itemsField).then(
            response => {
                if (this.props.update) this.setState({redirect: true});
                else this.props.onClick();
            },
        );
    };

    addItem = event => {
        // https://stackoverflow.com/questions/23966438/what-is-the-preferred-way-to-mutate-a-react-state
        // Concatenate an array with stepForms that includes the new step
        this.setState(state => ({
            itemsArray: state.itemsArray.concat({
                value: '',
                visible: true,
            }),
        }));
    };

    handleChange = (index, value) => {
        let newItemsArray = this.state.itemsArray;
        newItemsArray[index].value = value;
        this.setState({itemsArray: newItemsArray});
    };

    handleSubmit = event => {
        event.preventDefault();
        this.addItemsToDatabase();
    };

    handleDeleteItem = index => {
        var newItemsArray = this.removeItem(index);

        // Set the visible property of the new last step's delete button as true if the
        // user is adding steps/ingredients for the first time
        if (!this.props.update) {
            // Increase the number of steps listed in the state property
            newItemsArray[this.state.itemsArray.length - 1]['visible'] = false;

            if (this.state.numberOfItems > 1)
                newItemsArray[this.state.itemsArray.length - 1][
                    'visible'
                ] = true;
        }
        this.setState({itemsArray: newItemsArray});
        console.log('state: ' + this.state.itemsArray);
    };

    // https://stackoverflow.com/questions/29527385/removing-element-from-array-in-component-state

    removeItem(index) {
        return this.state.itemsArray.filter((_, i) => i !== index);
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

        if (!this.state.loading) {
            return (
                <Container>
                    <Row>
                        <Col lg={{size: 8, offset: 2}}>
                            <Form>
                                {this.state.itemsArray.map((item, index) => (
                                    <FormGroup key={'ItemFormGroup' + index}>
                                        <Item
                                            key={index + 'item'}
                                            id={index}
                                            value={item.value}
                                            onChange={this.handleChange}
                                            onClick={index =>
                                                this.handleDeleteItem(index)
                                            }
                                            onBlur={this.handleChange}
                                            deleteButton={item.visible}
                                            type={this.state.type}
                                        />
                                    </FormGroup>
                                ))}
                                <FormGroup>
                                    <Button
                                        className="formButtons"
                                        color="primary"
                                        onClick={this.addItem}>
                                        {this.addButtonText}
                                    </Button>
                                    <Button
                                        color="primary"
                                        onClick={event =>
                                            this.handleSubmit(event)
                                        }>
                                        Save
                                    </Button>
                                </FormGroup>
                            </Form>
                        </Col>
                    </Row>
                </Container>
            );
        } else {
            return null;
        }
    }
}

export default ItemForm;
