import React, {Component} from 'react';
import {Button, Popover, PopoverHeader, PopoverBody, Table} from 'reactstrap';

class PopOver extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showPopover: false,
            history: [],
        };
    }

    toggle = () => {
        this.setState({showPopover: !this.state.showPopover});
        console.log(this.state.history);
    };

    componentDidMount() {
        this.setState({history: this.props.history});
    }

    // Consulted https://stackoverflow.com/questions/41582197/state-not-updating-when-receiving-new-props-reactjs
    componentWillReceiveProps(newProps) {
        if (this.props !== newProps) {
            this.setState({history: this.props.history});
        }
    }

    render() {
        return (
            <div>
                <Button id="Popover1" type="button" onClick={this.toggle}>
                    Show History
                </Button>
                <Popover
                    placement="bottom"
                    isOpen={this.state.showPopover}
                    target="Popover1"
                    toggle={this.toggle}>
                    <PopoverHeader>Previously Made</PopoverHeader>
                    <PopoverBody>
                        <Table striped>
                            <tbody>
                                {this.state.history.map(date => (
                                    <tr key={date + 'row'}>
                                        <td>{date}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </PopoverBody>
                </Popover>
            </div>
        );
    }
}
export default PopOver;
