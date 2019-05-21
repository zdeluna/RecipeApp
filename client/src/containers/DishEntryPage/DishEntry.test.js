import React from 'react';
import Enzyme, {shallow, mount} from 'enzyme';
import DishEntry from './DishEntry';
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

jest.mock('../../utils/Api');

Enzyme.configure({adapter: new Adapter()});

describe('Dish List Table Page Component', () => {
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
