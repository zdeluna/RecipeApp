import React, {Component} from 'react';
import {Route, Redirect, BrowserRouter, Link} from 'react-router-dom';
import app from '../base';
import {Table, Container, Row, Button} from 'reactstrap';
import './Calendar.css';
import 'react-widgets/dist/css/react-widgets.css';
//import {DateTimePicker} from 'react-widgets';
import {ReactWidgets} from 'react-widgets';
import DateTimePicker from 'react-widgets/lib/DateTimePicker';
import Moment from 'moment';
import momentLocalizer from 'react-widgets-moment';
import API from '../utils/Api';

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
            if (response.status == 200) {
                this.setState({
                    history: response.data.history,
                });
            }
        });
    }

    /* This function will handle adding the history state object to the database*/
    addDateToDatabase = async () => {
        // If the state update field is true, then we need to make a put request instead of a post request
        var method = 'POST';
        if (this.state.updateDate) method = 'PUT';

        var update_url =
            '/api/users/' +
            this.state.user.uid +
            '/dish/' +
            this.state.dishId +
            '/history';

        //prettier-ignore
        fetch(update_url, {
			method: method,
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				history: this.state.history,
			})
		}).then(response => {
			// If the response status is 200, then we have created ingredients for the dish the first time, and need to let the parent component, NewDishForm, steps has been added by calling the onClick event.
			if (response.status == 200 || response.status == 303) {
			this.setState({dateIsScheduled: true});

			}
        });
    };

    /* Add the date to the history array in state */
    dateChanged = newDate => {
        var newDate = newDate.toLocaleDateString('en-US', this.dateOptions);
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
                    <Button
                        color="primary"
                        size="md"
                        onClick={this.addDateToDatabase}>
                        Schedule Dish
                    </Button>
                    <DateTimePicker
                        id="dateTimePicker"
                        time={false}
                        format="MMM DD YYYY"
                        defaultValue={new Date()}
                        onChange={value => this.dateChanged(value)}
                    />
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
