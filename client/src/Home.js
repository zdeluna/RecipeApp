import React, {Component} from 'react';
import CategoryButton from './CategoryButton';
import {Route, Redirect} from 'react-router-dom';
import {Row, Col, Container} from 'reactstrap';
import './Home.css';

const styles = {
    categoryButton: {
        padding: '10px',
    },
    categoryButtonContainer: {
        float: 'none',
        margin: '0 auto',
    },
};
class Home extends Component {
    state = {
        categoryButtons: [
            {id: 1, value: 'Dinner'},
            {id: 2, value: 'Breakfast'},
            {id: 3, value: 'Salads'},
            {id: 4, value: 'Fast Meals'},
        ],

        redirect: false,
        category: 0,
    };

    handleClick = (e, id) => {
        console.log('Event Handler Called', id);
        this.setState({redirect: true, category: id});
    };

    render() {
        if (this.state.redirect) {
            if (this.state.category === 1) {
                return <Redirect push to="users/category/1" />;
            } else if (this.state.category === 2) {
                return <Redirect push to="users/category/2" />;
            } else if (this.state.category === 3) {
                return <Redirect push to="users/category/3" />;
            } else if (this.state.category === 4) {
                return <Redirect push to="users/category/4" />;
            }
        }

        return (
            <Container>
                <Row>
                    <h3 class="col-centered">Categories</h3>
                </Row>
                {this.state.categoryButtons.map(categoryButton => (
                    <Col>
                        <CategoryButton
                            key={categoryButton.id}
                            onClick={e =>
                                this.handleClick(e, categoryButton.id)
                            }
                            value={categoryButton.value}
                        />
                    </Col>
                ))}
            </Container>
        );
    }
}

export default Home;
