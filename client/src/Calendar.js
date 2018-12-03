import React, {Component} from 'react';
import {Route, Redirect, BrowserRouter, Link} from 'react-router-dom';
import app from './base';
import {Table, Container, Row, Button} from 'reactstrap';
import './DishEntry.css';
import 'react-widgets/dist/css/react-widgets.css';
//import {DateTimePicker} from 'react-widgets';
import {ReactWidgets} from 'react-widgets';
import DateTimePicker from 'react-widgets/lib/DateTimePicker';
import Moment from 'moment';
import momentLocalizer from 'react-widgets-moment';

class Calendar extends Component {
    constructor() {
        super();
        this.state = {
            user: app.auth().currentUser,
            dates: [],
            history: [],
        };

        Moment.locale('en');
        momentLocalizer();
    }

    addDateToDatabase = async () => {
        // If the state update field is true, then we need to make a put request instead of a post request
        var method = 'POST';
        if (this.state.update) method = 'PUT';

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
			if (response.status == 200) {
			console.log("success");
			}
			else {
				this.setState({redirect: true});
		
			}
        });
    };

    componentDidMount() {
        this.setState({
            dishId: this.props.dishId,
            category: this.props.category,
        });
    }

    dateChanged = newDate => {
        console.log(newDate);
        this.setState({history: newDate});
    };

    render() {
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
                    format="MMM DD YYYY"
                    time={false}
                    defaultValue={new Date()}
                    onChange={value => this.dateChanged(value)}
                />
            </div>
        );
    }
}

export default Calendar;
