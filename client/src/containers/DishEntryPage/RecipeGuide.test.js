import React from 'react';
import Enzyme, {shallow, mount} from 'enzyme';
import RecipeGuide from './DishEntry';
import Adapter from 'enzyme-adapter-react-16';
import {Row, Col, Table, Container, Button} from 'reactstrap';

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

describe('Recipe Guide Component', () => {
    test('renders', () => {
        let testID = process.env.TEST_USER_ID;
        const wrapper = shallow(
            <Router>
                <RecipeGuide />
            </Router>,
        );
        expect(wrapper.exists()).toBe(true);
    });
});

test('carousel should render', async () => {
    const div = document.createElement('div');
    document.body.appendChild(div);

    const wrapper = await mount(
        <Router>
            <RecipeGuide steps ingredients} />
        </Router>,
        {attachTo: div},
    );

    await flushPromises();
    wrapper.update();
    expect(wrapper.find(Carousel)).toHaveLength(1);
});
