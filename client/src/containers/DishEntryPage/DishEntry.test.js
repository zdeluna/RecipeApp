import React from 'react';
import Enzyme, {shallow, mount} from 'enzyme';
import DishEntry from './DishEntry';
import AddDishForm from '../../components/AddDishForm';
import Adapter from 'enzyme-adapter-react-16';
import {Row, Col, Table, Container, Button} from 'reactstrap';
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

const flushPromises = () => new Promise(setImmediate);
const testID = process.env.TEST_USER_ID;
const dishId = '12345';
const category = '1';
const match = {params: {dishId: '12345', category: 1}};

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
    const div = document.createElement('div');
    document.body.appendChild(div);

    const wrapper = await mount(
        <Router>
            <DishEntry userID={testID} category={category} match={match} />
        </Router>,
        {attachTo: div},
    );

    await flushPromises();
    wrapper.update();
    expect(wrapper.find(Calendar)).toHaveLength(1);
    wrapper.unmount();
});

test('notes should render', async () => {
    const div = document.createElement('div');
    document.body.appendChild(div);

    const wrapper = await mount(
        <Router>
            <DishEntry userID={testID} category={category} match={match} />
        </Router>,
        {attachTo: div},
    );

    await flushPromises();
    wrapper.update();
    expect(wrapper.find(Notes)).toHaveLength(1);
    wrapper.unmount();
});

test('cooking time should render', async () => {
    const div = document.createElement('div');
    document.body.appendChild(div);

    const wrapper = await mount(
        <Router>
            <DishEntry userID={testID} category={category} match={match} />
        </Router>,
        {attachTo: div},
    );

    await flushPromises();
    wrapper.update();
    expect(wrapper.find(CookingTime)).toHaveLength(1);
    wrapper.unmount();
});

test('check to see if delete button calls handler to delete dish', async () => {
    const div = document.createElement('div');
    document.body.appendChild(div);

    const wrapper = await mount(
        <Router>
            <DishEntry userID={testID} category={category} match={match} />
        </Router>,
        {attachTo: div},
    );

    await flushPromises();
    wrapper.update();

    const componentInstance = wrapper.find(DishEntry).instance();
    const spyOnDeleteFunction = jest.spyOn(
        componentInstance,
        'deleteEntryFromDatabase',
    );

    componentInstance.forceUpdate();
    wrapper
        .find('#deleteDishButton')
        .first()
        .simulate('click');

    expect(spyOnDeleteFunction).toHaveBeenCalled();
    wrapper.unmount();
});

test('check if go back button is rendered', async () => {
    const div = document.createElement('div');
    document.body.appendChild(div);

    const wrapper = await mount(
        <Router>
            <DishEntry userID={testID} category={category} match={match} />
        </Router>,
        {attachTo: div},
    );

    await flushPromises();
    wrapper.update();

    expect(
        wrapper
            .find('#goBackLink')
            .first()
            .props().to,
    ).toBe('/users/category/1');
});
