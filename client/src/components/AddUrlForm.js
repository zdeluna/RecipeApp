import React, {Component} from 'react';
import {Route, Redirect} from 'react-router-dom';
import app from '../base';
import {
    Form,
    Button,
    FormGroup,
    Label,
    Input,
    FormText,
    Container,
} from 'reactstrap';
import API from '../utils/Api';

class AddUrlForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            value: '',
            user: app.auth().currentUser,
            urlAdded: false,
        };
    }

    handleChange = event => {
        this.setState({value: event.target.value});
    };

    handleSubmit = event => {
        event.preventDefault();
        this.addRecipeLink();
    };

    // Make a call to the api to handle parsing the recipe from the url
    addRecipeLink = async () => {
        // prettier-ignore
        let urlField = {url: this.state.value};

        const api = new API();
        api.updateDish(this.state.user.uid, this.props.dishId, urlField)
            .then(response => {
                this.setState({urlAdded: true});
                this.props.onClick();
            })
            .catch(error => {
                console.log(error.response);
            });
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
