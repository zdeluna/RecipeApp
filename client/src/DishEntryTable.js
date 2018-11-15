import React, {Component} from 'react';
import {Route, Redirect, BrowserRouter, Link} from 'react-router-dom';
import app from './base';
import {Table, Container, Row} from 'reactstrap';
import './DishEntry.css';

class DishEntryTable extends Component {
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

        if (this.state.type == 'Steps') {
            this.setState({
                striped: false,
            });
        }
    }

    render() {
        return (
            <Container>
                <Table size="sm" id={'entryTable' + this.state.type}>
                    <thead>
                        <tr>
                            <th>{this.props.type}</th>
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

export default DishEntryTable;
