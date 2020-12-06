import React, { useState } from "react";
import {
    Alert,
    Form,
    Button,
    FormGroup,
    Label,
    Input,
    Container
} from "reactstrap";
import "./AddUrlForm.css";
import { useMutation } from "@apollo/react-hooks";
import { UPDATE_DISH } from "../api/mutations/dish/updateDish";

const AddUrlForm = props => {
    const [url, setUrl] = useState("");
    const [userId] = useState(props.userId);
    const [dishId] = useState(props.dishId);
    const [showAlert, setShowAlert] = useState(false);
    const [updateDish] = useMutation(UPDATE_DISH, {
        onCompleted(updateDishResponse) {
            props.onClick();
        },
        onError(error) {
            setShowAlert(true);
        }
    });

    const handleSubmit = event => {
        event.preventDefault();
        addRecipeLink();
    };

    const handleChange = event => {
        let url = event.target.value;
        setUrl(url);
    };

    // Make a call to the api to handle parsing the recipe from the url
    const addRecipeLink = async () => {
        console.log("UPDATE DISH");
        // prettier-ignore
        updateDish({
            variables: {
                id: dishId,
                url: url,
            },
        });
    };
    const RenderAlert = props => {
        if (showAlert === true) {
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
