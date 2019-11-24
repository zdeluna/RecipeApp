import React, {useState} from 'react';
import app from '../base';
import {
    Alert,
    Form,
    Button,
    FormGroup,
    Label,
    Input,
    Container,
} from 'reactstrap';
import API from '../utils/Api';
import './AddUrlForm.css';
import gql from 'graphql-tag';
import {useMutation} from '@apollo/react-hooks';
import {Query} from 'react-apollo';

const UPDATE_DISH = gql`
    mutation updateDish($userId: String!, $dishId: String!, $url: String!) {
        updateDish(userId: $userId, dishId: $dishId, url: $url) {
            success
            message
        }
    }
`;

const AddUrlForm = props => {
    let urlAdded = false;
    const [url, setUrl] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [updateDish, {data}] = useMutation(UPDATE_DISH, {
        onCompleted({addDish}) {
            this.props.onClick();
        },
    });

    const handleChange = event => {
        setUrl(event.target.value);
    };

    const handleSubmit = event => {
        event.preventDefault();
        this.addRecipeLink();
    };

    // Make a call to the api to handle parsing the recipe from the url
    const addRecipeLink = async () => {
        // prettier-ignore
        let urlField = {url: {url}};
        updateDish({
            variables: {
                userId: props.userId,
                dishId: props.dishId,
                url: urlField,
            },
        });
    };
    const RenderAlert = props => {
        if ({showAlert} == true) {
            return (
                <Alert id="url_alert" color="primary">
                    Could not find ingredients/steps in Url.
                </Alert>
            );
        } else return null;
    };

    return (
        <div>
            <Container>
                <Form inline onSubmit={this.handleSubmit}>
                    <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                        <Label for="newUrlInput">Recipe Url:</Label>
                        <Input
                            type="text"
                            value={url}
                            onChange={this.handleChange}
                            id="newUrlInput"
                        />
                    </FormGroup>
                    <Button color="primary">Submit</Button>
                </Form>
                <RenderAlert />
            </Container>
        </div>
    );
};

export default AddUrlForm;
