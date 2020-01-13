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
import {act} from 'react-dom/test-utils';

import Loading from '../../components/Loading';
import {MockedProvider} from '@apollo/react-testing';
import {GET_DISHES} from '../../api/queries/dish/getAllDishes';

require('dotenv').config();
const flushPromises = () => new Promise(setImmediate);
const match = {params: {category: 1}};

const testId = process.env.TEST_USER_ID;

Enzyme.configure({adapter: new Adapter()});

const dishes = [
    {
        id: '111111',
        name: 'Fajitas',
        category: '1',
        lastMade: 'Saturday January 1st',
        cookingTime: '22 minutes',
    },
    {
        id: '111112',
        name: 'Tacos',
        category: '1',
        lastMade: 'Sunday January 2nd',
        cookingTime: '43 minutes',
    },
];

const mocks = [
    {
        request: {
            query: GET_DISHES,
            variables: {userId: testId},
        },
        result: {
            data: {
                dishes: dishes,
            },
        },
    },
];

describe('Dish List Table Page Component', () => {
    test('renders', async () => {
        const wrapper = shallow(
            <MockedProvider mocks={mocks} addTypename={false}>
                <DishListTable userId={testId} match={match} />
            </MockedProvider>,
        );

        await flushPromises();
        wrapper.update();

        expect(wrapper.exists()).toBe(true);
    });

    test('add new dish form should render', async () => {
        await act(async () => {
            const wrapper = await mount(
                <Router>
                    <MockedProvider mocks={mocks} addTypename={false}>
                        <DishListTable userId={testId} match={match} />
                    </MockedProvider>
                </Router>,
            );

            await flushPromises();
            wrapper.update();

            expect(wrapper.find(AddDishForm)).toHaveLength(1);
            wrapper.unmount();
        });
    });

    test('users dish link should render using mock api data ', async () => {
        await act(async () => {
            const wrapper = await mount(
                <Router>
                    <MockedProvider mocks={mocks} addTypename={false}>
                        <DishListTable userId={testId} match={match} />
                    </MockedProvider>
                </Router>,
            );

            await flushPromises();
            wrapper.update();

            expect(wrapper.find('Link.dishLink')).toHaveLength(
                Object.keys(dishes).length,
            );
            wrapper.unmount();
        });
    });

    test('Go back link should display', async () => {
        await act(async () => {
            const wrapper = await mount(
                <Router>
                    <MockedProvider mocks={mocks} addTypename={false}>
                        <DishListTable userId={testId} match={match} />
                    </MockedProvider>
                </Router>,
            );

            await flushPromises();
            wrapper.update();

            expect(wrapper.find('Link #goBackLink').text()).toEqual(
                'Go Back To Categories',
            );
            wrapper.unmount();
        });
    });

    test('the number of rows is correct given a set of dishes', async () => {
        await act(async () => {
            const wrapper = await mount(
                <Router>
                    <MockedProvider mocks={mocks} addTypename={false}>
                        <DishListTable userId={testId} match={match} />
                    </MockedProvider>
                </Router>,
            );

            await flushPromises();
            wrapper.update();

            expect(wrapper.find('tbody tr')).toHaveLength(
                Object.keys(dishes).length,
            );
            wrapper.unmount();
        });
    });
});
