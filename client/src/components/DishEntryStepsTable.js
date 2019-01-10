import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import app from '../base';
import {Table, Container} from 'reactstrap';
import './DishEntryStepsTable.css';

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

    // Consulted https://stackoverflow.com/questions/41582197/state-not-updating-when-receiving-new-props-reactjs
    componentWillReceiveProps(newProps) {
        if (this.props !== newProps) {
            this.setState({entries: this.props.entries});
        }
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
                        {this.state.entries.map((entry, index) => (
                            <tr key={index + 'r'}>
                                <td key={index + 'c'}>
                                    {index + 1}) {entry.value}
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
