import React, {Component} from 'react';
import {Route, Redirect, BrowserRouter, Link} from 'react-router-dom';
import app from './base';
import {Table, Container, Row} from 'reactstrap';
import './DishListTable.css';

class DishEntryTable extends Component {
    constructor() {
        super();
        this.state = {
            user: app.auth().currentUser,
            entries: [],
            type: '',
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
                <Table className="entryTable">
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
