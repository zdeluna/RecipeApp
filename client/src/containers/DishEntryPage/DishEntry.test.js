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

const testId = process.env.TEST_USER_ID;
const dishId = '12345';
const category = '1';
const match = {params: {dishId: dishId, category: 1}};

import {MockedProvider} from '@apollo/react-testing';
import {GET_DISH} from '../../api/queries/dish/getDish';

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
];

describe('Dish Entry Page Component', () => {
    test('renders', async () => {
        const wrapper = shallow(
            <MockedProvider mocks={mocks} addTypename={false}>
                <DishEntry userId={testId} match={match} />
            </MockedProvider>,
        );

        await flushPromises();
        wrapper.update();

        expect(wrapper.exists()).toBe(true);
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

    /*

    test('check to see if delete button calls handler to delete dish', async () => {
        const div = document.createElement('div');
        document.body.appendChild(div);

        const wrapper = await mount(
            <Router>
                <DishEntry userId={testID} category={category} match={match} />
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
    });

    test('check if go back button is rendered', async () => {
        const div = document.createElement('div');
        document.body.appendChild(div);

        const wrapper = await mount(
            <Router>
                <DishEntry userId={testID} category={category} match={match} />
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

    test('check to see if make dish mode calls handler to make dish mode', async () => {
        const div = document.createElement('div');
        document.body.appendChild(div);

        const wrapper = await mount(
            <Router>
                <DishEntry userId={testID} category={category} match={match} />
            </Router>,
            {attachTo: div},
        );

        await flushPromises();
        wrapper.update();

        const componentInstance = wrapper.find(DishEntry).instance();
        const spyOnDeleteFunction = jest.spyOn(
            componentInstance,
            'makeDishModeButton',
        );

        componentInstance.forceUpdate();
        wrapper
            .find('#makeDishModeButton')
            .first()
            .simulate('click');

        expect(spyOnDeleteFunction).toHaveBeenCalled();
                });*/
});
