//@format

import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';
import app from '../base';
import Item from './Item';
import {Form, Button, FormGroup, Container, Col, Row} from 'reactstrap';
import API from '../utils/Api';
import './ItemForm.css';
import {UPDATE_DISH} from '../api/mutations/dish/updateDish';

const ItemForm = props => {
    const client = useApolloClient();
    const [userId, setUserId] = useState(props.userId);
    const [dishId, setDishId] = useState(props.dishId);
    const [type, setType] = useState(props.type);
    const [itemsArray, setItemsArray] = useState([
        {id: 0, value: '', visible: false},
    ]);

    const [updateDish, {data}] = useMutation(UPDATE_DISH, {
        onCompleted(updateDishResponse) {
            props.onClick();
        },
    });

    const addItemsToDatabase = async () => {
        // Only store the value fields from itemsArray.
        var itemsData = itemsArray.map(function(item) {
            return {
                value: item.value,
            };
        });

        let itemsField = {[type]: itemsData};
    };

    const addItem = event => {
        // https://stackoverflow.com/questions/23966438/what-is-the-preferred-way-to-mutate-a-react-state
        // Concatenate an array with stepForms that includes the new step
        this.setState(state => ({
            itemsArray: state.itemsArray.concat({
                value: '',
                visible: true,
            }),
        }));
    };

    const handleChange = (index, value) => {
        let newItemsArray = this.state.itemsArray;
        newItemsArray[index].value = value;
        this.setState({itemsArray: newItemsArray});
    };

    const handleSubmit = event => {
        event.preventDefault();
        addItemsToDatabase();
    };

    const handleDeleteItem = index => {
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
                                    key={index + 'item'}
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
                                {this.addButtonText}
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

/*
};

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

                    */

//export default ItemForm;
