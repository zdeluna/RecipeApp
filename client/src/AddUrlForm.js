import React, {Component} from 'react';
import {Route, Redirect} from 'react-router-dom';
import app from './base';
import {
    Form,
    Button,
    FormGroup,
    Label,
    Input,
    FormText,
    Container,
} from 'reactstrap';

class AddUrlForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            value: '',
            user: app.auth().currentUser,
        };
    }

    handleChange = event => {
        this.setState({value: event.target.value});
    };

    handleSubmit = event => {
        //alert('A name was submitted: ' + this.state.value);
        event.preventDefault();

        const category = 1;

        // Get the category of the dish from the query in the url

        this.addRecipeLink();
    };

    // Make a call to the api to handle parsing the recipe from the url
    addRecipeLink = async () => {
        // prettier-ignore
        fetch(`/api/users/${this.state.user.uid}/dish/${this.props.dishId}/recipe/url`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                url: this.state.value,
            })
        })
    };

    render() {
        return (
            <div>
                <Container>
                    <Form inline onSubmit={this.handleSubmit}>
                        <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                            <Label for="newUrlInput">Recipe Url:</Label>
                            <Input
                                type="text"
                                value={this.state.value}
                                onChange={this.handleChange}
                                id="newUrlInput"
                            />
                        </FormGroup>
                        <Button color="primary">Submit</Button>
                    </Form>
                </Container>
            </div>
        );
    }
}

export default AddUrlForm;
