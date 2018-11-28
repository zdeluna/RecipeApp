import React, {Component} from 'react';
import {Route, Redirect, BrowserRouter, Link} from 'react-router-dom';
import app from './base';
import {Table, Container, Row} from 'reactstrap';
import './DishEntry.css';

class DishEntryStepsTable extends Component {
    constructor() {
        super();
        this.state = {
            user: app.auth().currentUser,
            entries: [],
            type: '',
            striped: false,
        };
    }

    componentDidMount() {
        this.setState({
            entries: this.props.entries,
            type: this.props.type,
        });
    }

    render() {
        return (
            <Container>
                <Table striped size="sm" id="dishEntryStepsTable">
                    <thead>
                        <tr>
                            <th>
                                {this.props.type}{' '}
                                <Link
                                    to={`/users/category/${
                                        this.props.category
                                    }/dish/${this.props.dishId}/steps`}>
                                    Edit
                                </Link>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.entries.map(entry => (
                            <tr key={entry.id + 'r'}>
                                <td key={entry.id + 'c'}>
                                    {entry.id + 1}) {entry.value}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Container>
        );
    }
}

export default DishEntryStepsTable;
