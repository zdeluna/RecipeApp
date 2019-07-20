import React, {Component} from 'react';
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

class AddUrlForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            value: '',
            user: app.auth().currentUser,
            urlAdded: false,
            showAlert: false,
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
        try {
            const api = new API();
            let response = await api.updateDish(
                this.state.user.uid,
                this.props.dishId,
                urlField,
            );

            if (response.status === 200) {
                this.setState({urlAdded: true});
                this.props.onClick();
            }
        } catch (error) {
            this.setState({showAlert: true});
        }
    };
    renderAlert = props => {
        if (this.state.showAlert) {
            return (
                <Alert id="url_alert" color="primary">
                    Could not find ingredients/steps in Url.
                </Alert>
            );
        } else return null;
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
                    <this.renderAlert />
                </Container>
            </div>
        );
    }
}

export default AddUrlForm;
