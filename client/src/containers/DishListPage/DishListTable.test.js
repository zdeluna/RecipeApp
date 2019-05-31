import React from 'react';
import Enzyme, {shallow, mount} from 'enzyme';
import DishListTable from './DishListTable';
import AddDishForm from '../../components/AddDishForm';
import Adapter from 'enzyme-adapter-react-16';
import {Row, Col, Table, Container} from 'reactstrap';
import {
    Link,
    MemoryRouter,
    withRouter,
    BrowserRouter as Router,
} from 'react-router-dom';

import app from '../../base';
import API from '../../utils/Api';
import Loading from '../../components/Loading';

require('dotenv').config();
const flushPromises = () => new Promise(setImmediate);
const match = {params: {category: 1}};

jest.mock('../../utils/Api');

Enzyme.configure({adapter: new Adapter()});

describe('Dish List Table Page Component', () => {
    test('renders', async () => {
        let testID = process.env.TEST_USER_ID;
        const wrapper = shallow(
            <Router>
                <DishListTable userID={testID} match={match} />
            </Router>,
        );

        await flushPromises();
        wrapper.update();

        expect(wrapper.exists()).toBe(true);
    });

    test('add new dish form should render', async () => {
        let testID = process.env.TEST_USER_ID;

        const wrapper = await mount(
            <Router>
                <DishListTable userID={testID} match={match} />
            </Router>,
        );

        await flushPromises();
        wrapper.update();

        expect(wrapper.find(AddDishForm)).toHaveLength(1);
        wrapper.unmount();
    });

    test('users dish link should render using mock api data ', async () => {
        let testID = process.env.TEST_USER_ID;

        const wrapper = await mount(
            <Router>
                <DishListTable loading={false} userID={testID} match={match} />
            </Router>,
        );

        await flushPromises();
        wrapper.update();

        expect(wrapper.find('Link .dishLink')).toHaveLength(1);
        wrapper.unmount();
    });

    test('loading page does not show', async () => {
        let testID = process.env.TEST_USER_ID;

        const wrapper = await mount(
            <Router>
                <DishListTable loading={false} userID={testID} match={match} />
            </Router>,
        );

        await flushPromises();
        wrapper.update();

        expect(wrapper.find(Loading)).toHaveLength(0);
        wrapper.unmount();
    });

    test('categories link should display', async () => {
        let testID = process.env.TEST_USER_ID;

        const wrapper = await mount(
            <Router>
                <DishListTable loading={false} userID={testID} match={match} />
            </Router>,
        );

        await flushPromises();
        wrapper.update();

        expect(wrapper.find('Link #goBackLink').text()).toEqual(
            'Go Back To Categories',
        );
        wrapper.unmount();
    });

    test('the number of rows is correct given a set of dishes', async () => {
        let testID = process.env.TEST_USER_ID;

        const dishes = {
            id1: {name: 'Fajitas'},
            id2: {name: 'Fish tacos'},
            id3: {name: 'Gumbo'},
        };

        const wrapper = await mount(
            <Router>
                <DishListTable
                    dishes={dishes}
                    loading={false}
                    userID={testID}
                    match={match}
                />
            </Router>,
        );

        await flushPromises();
        wrapper.update();

        expect(wrapper.find('tbody tr').children()).toHaveLength(
            Object.keys(dishes).length,
        );
        wrapper.unmount();
    });
});
