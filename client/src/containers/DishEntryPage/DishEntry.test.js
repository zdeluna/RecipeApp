import React from 'react';
import Enzyme, {shallow, mount} from 'enzyme';
import DishEntry from './DishEntry';
import AddDishForm from '../../components/AddDishForm';
import Adapter from 'enzyme-adapter-react-16';
import {Row, Col, Table, Container} from 'reactstrap';
import Calendar from '../../components/Calendar';
import Loading from '../../components/Loading';
import Notes from '../../components/Notes';
import CookingTime from '../../components/CookingTime';
import NewDishForm from '../../components/NewDishForm';

import {
    Link,
    MemoryRouter,
    withRouter,
    BrowserRouter as Router,
} from 'react-router-dom';

import app from '../../base';
import API from '../../utils/Api';

require('dotenv').config();

jest.mock('../../utils/Api');

Enzyme.configure({adapter: new Adapter()});

describe('Dish Entry Page Component', () => {
    test('renders', () => {
        let testID = process.env.TEST_USER_ID;
        const wrapper = shallow(
            <Router>
                <DishEntry />
            </Router>,
        );
        expect(wrapper.exists()).toBe(true);
    });
});

test('calendar should render', async () => {
    let testID = process.env.TEST_USER_ID;
    let dishId = '12345';
    let category = '1';
    const match = {params: {dishId: '12345'}};

    const div = document.createElement('div');
    document.body.appendChild(div);

    const steps = ['1'];
    const ingredients = ['1'];

    const wrapper = await mount(
        <Router>
            <DishEntry
                steps={steps}
                ingredients={ingredients}
                userID={testID}
                category={category}
                match={match}
            />
        </Router>,
        {attachTo: div},
    );

    console.log(wrapper.debug());
    expect(wrapper.find(Calendar)).toHaveLength(1);
});
