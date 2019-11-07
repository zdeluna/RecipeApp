import React, {Component} from 'react';
import app from '../base';
import {Form, Button, FormGroup, Label, Input, Container} from 'reactstrap';
import './AddDishForm.css';
import API from '../utils/Api';
import {ApolloClient} from 'apollo-boost';
import {ApolloProvider} from 'react-apollo';
import {gql} from 'apollo-boost';
import {graphql} from 'react-apollo';
import {useMutation} from '@apollo/react-hooks';
import {Query} from 'react-apollo';

const ADD_DISH = gql`
    mutation addDish($name: String!, $category: String!, $uid: ID!) {
        addDish(name: $name, category: $category, uid: $uid) {
            id
            name
        }
    }
`;

function AddDish(props) {
    let input = {value: ''};
    const [addDish, {data}] = useMutation(ADD_DISH);

    return (
        <Container>
            <Form
                inline
                onSubmit={e => {
                    e.preventDefault();
                    addDish({
                        variables: {
                            name: input.value,
                            category: props.category,
                            uid: props.uid,
                        },
                    });
                    input.value = '';
                }}>
                <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                    <Label for="newDishInput">New Dish Name: </Label>
                    <Input
                        type="text"
                        id="newDishInput"
                        onChange={e => {
                            input.value = e.target.value;
                        }}
                    />
                </FormGroup>
                <Button color="primary">Submit</Button>
            </Form>
        </Container>
    );
}

class AddDishForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            value: '',
            user: app.auth().currentUser,
            category: this.props.category,
        };
    }

    handleChange = event => {
        this.setState({value: event.target.value});
    };

    // Make a call to the api to handle parsing the recipe from the url
    addNewDish = async (userId, dishName, category) => {
        // prettier-ignore

        let newDish = {};
        newDish.name = dishName;
        newDish.category = category;

        /*
		const api = new API();

        api.createDish(this.state.user.uid, newDish).then(response => {
            if (response.status === 201) this.props.onClick(response.data.id);
		

});*/
    };

    render() {
        return (
            <div>
                <AddDish
                    category={this.state.category}
                    uid={this.state.user.uid}
                />
            </div>
        );
    }
}

export default AddDishForm;
