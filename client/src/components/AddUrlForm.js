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
import {useApolloClient} from '@apollo/react-hooks';

const UPDATE_DISH = gql`
    mutation updateDish($userId: String!, $dishId: String!, $url: String) {
        updateDish(userId: $userId, dishId: $dishId, url: $url) {
            success
            message
            dish {
                id
                name
                url
                steps {
                    id
                    value
                }
                ingredients {
                    id
                    value
                }
            }
        }
    }
`;

const AddUrlForm = props => {
    const client = useApolloClient();

    let urlAdded = false;
    const [url, setUrl] = useState('');
    const [userId, setUserId] = useState(props.userId);
    const [dishId, setDishId] = useState(props.dishId);
    const [showAlert, setShowAlert] = useState(false);
    const [updateDish, {data}] = useMutation(UPDATE_DISH, {
        onCompleted(updateDishResponse) {
            console.log('AFTER UPDATE: ' + updateDishResponse);
            //props.onClick();
        },
    });

    console.log(userId + ' ' + dishId);

    const handleSubmit = event => {
        event.preventDefault();
        addRecipeLink();
    };

    const handleChange = event => {
        let url = event.target.value;
        setUrl(url);
        console.log(url);
    };

    // Make a call to the api to handle parsing the recipe from the url
    const addRecipeLink = async () => {
        console.log('UPDATE DISH');
        // prettier-ignore
        updateDish({
            variables: {
                userId: userId,
                dishId: dishId,
                url: url,
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
                <Form inline onSubmit={handleSubmit}>
                    <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                        <Label for="newUrlInput">Recipe Url:</Label>
                        <Input
                            type="text"
                            value={url}
                            onChange={e => {
                                handleChange(e);
                            }}
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
