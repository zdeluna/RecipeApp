import React, {Component} from 'react';
import app from '../base';
import {Row, Col, Button} from 'reactstrap';
import './Calendar.css';
import 'react-widgets/dist/css/react-widgets.css';
import DateTimePicker from 'react-widgets/lib/DateTimePicker';
import Moment from 'moment';
import momentLocalizer from 'react-widgets-moment';
import API from '../utils/Api';
import PopOver from './PopOver';

class Calendar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: app.auth().currentUser,
            history: [],
            newScheduleDate: '',
            dateIsScheduled: false,
            updateDate: false,
        };

        Moment.locale('en');
        momentLocalizer();

        this.dateOptions = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        };
    }

    /* Store the value of the history from the database to the history in state */
    componentDidMount() {
        // First set the dishId and category will be used to create our url for the GET request
        this.setState({
            dishId: this.props.dishId,
            category: this.props.category,
        });

        var api = new API();
        api.getDish(this.state.user.uid, this.props.dishId).then(response => {
            if (response.status === 200) {
                if (response.data.history)
                    this.setState({
                        history: response.data.history,
                    });
                this.forceUpdate();
            }
        });
    }

    /* This function will handle adding the history state object to the database*/
    addDateToDatabase = async () => {
        // If the state update field is true, then we need to make a put request instead of a post request

        const api = new API();
        let historyField = {history: this.state.history};
        api.updateDish(this.state.user.uid, this.props.dishId, historyField)
            .then(response => {
                this.setState({dateIsScheduled: true});
            })
            .catch(error => {
                console.log(error.response);
            });
    };

    /* Add the date to the history array in state */
    dateChanged = newDate => {
        newDate = newDate.toLocaleDateString('en-US', this.dateOptions);
        // If the user has not entered scheduled the dish, then just add the date to the end of the array
        var newHistory = this.state.history;
        if (this.state.updateDate) newHistory = this.removeDate(newHistory, 0);
        newHistory.unshift(newDate);
        this.setState({history: newHistory, newScheduleDate: newHistory[0]});
    };

    updateDate = () => {
        this.setState({updateDate: true, dateIsScheduled: false});
    };

    /* Render the components based on if the user has already sheduled the dish today*/
    renderComponents = props => {
        const dateIsScheduled = props.dateIsScheduled;
        if (!dateIsScheduled)
            return (
                <div>
                    {' '}
                    <Row>
                        <Col>
                            <Button
                                color="primary"
                                size="md"
                                onClick={this.addDateToDatabase}>
                                Schedule Dish
                            </Button>
                        </Col>
                        <Col>
                            <PopOver history={this.state.history} />
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <DateTimePicker
                                id="dateTimePicker"
                                time={false}
                                format="MMM DD YYYY"
                                defaultValue={new Date()}
                                onChange={value => this.dateChanged(value)}
                            />
                        </Col>
                    </Row>
                </div>
            );
        else
            return (
                <div>
                    <h3>Scheduled for {this.state.newScheduleDate}</h3>
                    <Button color="primary" size="md" onClick={this.updateDate}>
                        Reschedule Dish
                    </Button>
                </div>
            );
    };

    removeDate(array, index) {
        // Remove a date from the history array

        return array.filter((_, i) => i !== index);
    }

    render() {
        return (
            <div id="calendarComponent">
                <this.renderComponents
                    dateIsScheduled={this.state.dateIsScheduled}
                />
            </div>
        );
    }
}

export default Calendar;
