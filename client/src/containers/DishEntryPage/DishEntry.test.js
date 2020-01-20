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
import {act} from 'react-dom/test-utils';
import wait from 'waait';

import {
    Link,
    MemoryRouter,
    withRouter,
    BrowserRouter as Router,
} from 'react-router-dom';

import app from '../../base';
import API from '../../utils/Api';

import {MockedProvider} from '@apollo/react-testing';
import {GET_DISH} from '../../api/queries/dish/getDish';
import {DELETE_DISH} from '../../api/mutations/dish/deleteDish';

require('dotenv').config();

jest.mock('../../utils/Api');

const flushPromises = () => new Promise(setImmediate);

const testId = process.env.TEST_USER_ID;
const dishId = '12345';
const category = '1';
const match = {params: {dishId: dishId, category: 1}};

Enzyme.configure({adapter: new Adapter()});

const dish = {
    id: '111111',
    name: 'Fajitas',
    category: '1',
    lastMade: 'Saturday, January 11, 2020',
    cookingTime: '22 minutes',
    steps: [{value: 'Light the grill'}],
    ingredients: [{value: 'Steak'}],
    history: ['Saturday, January 11, 2020'],
    ingredientsInSteps: [{step: 1, ingredients: [{value: 'Cheese'}]}],
    notes: 'This is a note',
    url: 'http://recipeaddress.com',
    __typename: 'Dish',
};

const mocks = [
    {
        request: {
            query: GET_DISH,
            variables: {userId: testId, dishId: dishId},
        },
        result: {
            data: {
                dish: dish,
            },
        },
    },
    {
        request: {
            query: DELETE_DISH,
            variables: {userId: testId, dishId: dishId},
        },
        result: {
            data: {
                deleteDish: {
                    success: true,
                    message: 'The dish has been deleted',
                },
            },
        },
    },
];

describe('Dish Entry Page Component', async () => {
    test('renders', async () => {
        await act(async () => {
            const wrapper = shallow(
                <MockedProvider mocks={mocks} addTypename={false}>
                    <DishEntry userId={testId} match={match} />
                </MockedProvider>,
            );

            await flushPromises();
            wrapper.update();

            expect(wrapper.exists()).toBe(true);
        });
    });

    test('calendar should render', async () => {
        await act(async () => {
            const div = document.createElement('div');
            document.body.appendChild(div);

            const wrapper = await mount(
                <Router>
                    <MockedProvider mocks={mocks} addTypename={false}>
                        <DishEntry userId={testId} match={match} />
                    </MockedProvider>
                </Router>,
                {attachTo: div},
            );

            await flushPromises();
            wrapper.update();
            expect(wrapper.find(Calendar)).toHaveLength(1);
            wrapper.unmount();
        });
    });

    test('notes should render', async () => {
        await act(async () => {
            const div = document.createElement('div');
            document.body.appendChild(div);

            const wrapper = await mount(
                <Router>
                    <MockedProvider mocks={mocks} addTypename={false}>
                        <DishEntry userId={testId} match={match} />
                    </MockedProvider>
                </Router>,
                {attachTo: div},
            );

            await flushPromises();
            wrapper.update();
            expect(wrapper.find(Notes)).toHaveLength(1);
            wrapper.unmount();
        });
    });

    test('cooking time should render', async () => {
        await act(async () => {
            const div = document.createElement('div');
            document.body.appendChild(div);

            const wrapper = await mount(
                <Router>
                    <MockedProvider mocks={mocks} addTypename={false}>
                        <DishEntry userId={testId} match={match} />
                    </MockedProvider>
                </Router>,
                {attachTo: div},
            );

            await flushPromises();
            wrapper.update();
            expect(wrapper.find(CookingTime)).toHaveLength(1);
            wrapper.unmount();
        });
    });

    test('check to see if delete button redirects after deleting a dish', async () => {
        await act(async () => {
            const div = document.createElement('div');
            document.body.appendChild(div);

            const historyMock = {push: jest.fn()};

            const wrapper = await mount(
                <Router>
                    <MockedProvider mocks={mocks} addTypename={false}>
                        <DishEntry
                            userId={testId}
                            history={historyMock}
                            match={match}
                        />
                    </MockedProvider>
                </Router>,
                {attachTo: div},
            );

            await flushPromises();
            wrapper.update();

            wrapper
                .find('#deleteDishButton')
                .first()
                .props()
                .onClick();

            wrapper.update();
            await wait();

            expect(historyMock.push.mock.calls[0]).toEqual([
                '/users/category/1',
            ]);
        });
    });

    test('check to see if back button redirects', async () => {
        await act(async () => {
            const div = document.createElement('div');
            document.body.appendChild(div);

            const historyMock = {push: jest.fn()};

            const wrapper = await mount(
                <Router>
                    <MockedProvider mocks={mocks} addTypename={false}>
                        <DishEntry
                            userId={testId}
                            history={historyMock}
                            match={match}
                        />
                    </MockedProvider>
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
    });

    test('check to see if make dish mode is rendered once button is clicked', async () => {
        await act(async () => {
            const div = document.createElement('div');
            document.body.appendChild(div);

            const historyMock = {push: jest.fn()};

            const wrapper = await mount(
                <Router>
                    <MockedProvider mocks={mocks} addTypename={false}>
                        <DishEntry
                            userId={testId}
                            history={historyMock}
                            match={match}
                        />
                    </MockedProvider>
                </Router>,
                {attachTo: div},
            );

            await flushPromises();
            wrapper.update();

            wrapper
                .find('#makeDishModeButton')
                .first()
                .props()
                .onClick();

            wrapper.update();
            await wait();

            expect(historyMock.push.mock.calls[0][0]).toEqual(
                `/users/category/${category}/dish/${dishId}/makeMode`,
            );
        });
    });
});
