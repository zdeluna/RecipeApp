import React, {Component} from 'react';
import {Button, Container, Row} from 'reactstrap';

class CategoryButton extends Component {
    state = {
        value: this.props.value,
    };

    handleClick = () => {
        console.log();
    };

    render() {
        return (
            <div>
                <Container>
                    <Row className=".col-sm-12 .col-md-6 .offset-md-3 .col-centered">
                        <Button
                            color="primary"
                            size="lg"
                            className="button-centered"
                            onClick={this.props.onClick}>
                            {this.state.value}
                        </Button>
                    </Row>
                </Container>
            </div>
        );
    }
}

export default CategoryButton;
