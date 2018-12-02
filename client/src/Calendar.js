import React, {Component} from 'react';
import {Route, Redirect, BrowserRouter, Link} from 'react-router-dom';
import app from './base';
import {Table, Container, Row} from 'reactstrap';
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
            dishId: '',
            category: '',
            dates: [],
        };

        Moment.locale('en');
        momentLocalizer();

        // let {DateTimePicker} = ReactWidgets;
        // let formatter = Globalize.dateFormatter({date: 'short'});
        /* let widget = (
            <DateTimePicker
                //editFormat={formatter}
                defaultValue={new Date()}
                format={{raw: 'mmm YYY'}}
                // time={false}
            />
   );
   */
    }

    componentDidMount() {
        this.setState({
            dishId: this.props.dishId,
            category: this.props.category,
        });
    }

    render() {
        return (
            <div>
                {' '}
                <DateTimePicker format="mmm YYY" />
            </div>
        );
    }
}

export default Calendar;
