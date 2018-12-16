import React, {Component} from 'react';
import {Route, Redirect, BrowserRouter, Link} from 'react-router-dom';
import app from '../base';
import {Table, Container, Row} from 'reactstrap';
import './DishEntryIngredientsTable.css';

class DishEntryIngredientsTable extends Component {
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

    // Consulted https://stackoverflow.com/questions/41582197/state-not-updating-when-receiving-new-props-reactjs
    componentWillReceiveProps(newProps) {
        if (this.props != newProps) {
            this.setState({entries: this.props.entries});
        }
    }

    render() {
        return (
            <Container>
                <Table borderless size="sm" id="dishEntryIngredientsTable">
                    <thead>
                        <tr>
                            <th>
                                {this.props.type}{' '}
                                <Link
                                    to={`/users/category/${
                                        this.props.category
                                    }/dish/${this.props.dishId}/ingredients`}>
                                    Edit
                                </Link>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.entries.map(entry => (
                            <tr key={entry.id + 'r'}>
                                <td key={entry.id + 'c'}>{entry.value}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Container>
        );
    }
}

export default DishEntryIngredientsTable;
