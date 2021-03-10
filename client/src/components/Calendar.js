import React, { useState, useEffect } from "react";
import { Row, Col, Button } from "reactstrap";
import "./Calendar.css";
import "react-widgets/dist/css/react-widgets.css";
import DateTimePicker from "react-widgets/lib/DateTimePicker";
import Moment from "moment";
import momentLocalizer from "react-widgets-moment";
import PopOver from "./PopOver";
import { UPDATE_DISH } from "../api/mutations/dish/updateDish";
import { GET_DISH } from "../api/queries/dish/getDish";
import { useMutation, useQuery } from "@apollo/react-hooks";

const Calendar = props => {
    const [userId] = useState(props.userId);
    const [dishId] = useState(props.dishId);
    const [history, setHistory] = useState(props.history);
    const [newScheduleDate, setNewScheduleDate] = useState("");
    const [dateIsScheduled, setDateIsScheduled] = useState(props.scheduled);
    const [updateDate, setUpdateDate] = useState(false);
    const [datePickerValue, setDatePickerValue] = useState(new Date());
    const [dish, setDish] = useState("");

    console.log("calendar flag value");
    console.log(dateIsScheduled);

    const [updateDish] = useMutation(UPDATE_DISH);

    const { loading, data } = useQuery(GET_DISH, {
        variables: {
            id: dishId
        }
    });

    useEffect(
        () => {
            if (!loading) {
                setDish(data.dish);
                console.log(data.dish);

                if (props.scheduled) setNewScheduleDate(data.dish.history[0]);
            }
        },
        [loading]
    );

    Moment.locale("en");
    momentLocalizer();

    const dateOptions = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
    };

    /* This function will handle adding the history state object to the database*/
    const addDateToDatabase = async () => {
        // User has selected the default date (today)
        if (!newScheduleDate) {
            dateChanged(new Date());
        }

        setDateIsScheduled(true);

        props.scheduleDish();

        updateDish({
            variables: {
                id: dishId,
                ...dish,
                history: history,
                lastMade: history[0]
            }
        });
    };

    /* Add the date to the history array in state */
    const dateChanged = newDate => {
        setDatePickerValue(newDate);

        newDate = newDate.toLocaleDateString("en-US", dateOptions);
        // If the user has not entered scheduled the dish, then just add the date to the end of the array
        let newHistory = history;
        if (updateDate) newHistory = removeDate(newHistory, 0);

        newHistory.unshift(newDate);
        setHistory(newHistory);
        setNewScheduleDate(newHistory[0]);
    };

    const updateCurrentDate = () => {
        setUpdateDate(true);
        setDateIsScheduled(false);
    };

    const removeDate = (array, index) => {
        // Remove a date from the history array

        return array.filter((_, i) => i !== index);
    };

    /* Render the components based on if the user has already scheduled the dish today*/
    if (!dateIsScheduled)
        return (
            <div>
                {" "}
                <Row>
                    <Col>
                        <Button
                            color="primary"
                            size="md"
                            onClick={addDateToDatabase}
                        >
                            Schedule Dish
                        </Button>
                    </Col>
                    <Col>
                        <PopOver history={history} />
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <DateTimePicker
                            id="dateTimePicker"
                            time={false}
                            format="MMM DD YYYY"
                            value={datePickerValue}
                            defaultValue={new Date()}
                            onChange={value => dateChanged(value)}
                        />
                    </Col>
                </Row>
            </div>
        );
    else
        return (
            <div>
                <h3>Scheduled for {newScheduleDate}</h3>
                <Button color="primary" size="md" onClick={updateCurrentDate}>
                    Reschedule Dish
                </Button>
            </div>
        );
};

export default Calendar;
