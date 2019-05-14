import React from 'react';
import Enzyme, {shallow, mount} from 'enzyme';
import DishListTable from './DishListTable';
import AddDishForm from '../../components/AddDishForm';
import Adapter from 'enzyme-adapter-react-16';
import {Row, Col, Container} from 'reactstrap';
import {BrowserRouter as Router} from 'react-router-dom';
import app from '../../base';
import API from '../../utils/Api';

require('dotenv').config();

jest.mock('../../utils/Api');

Enzyme.configure({adapter: new Adapter()});

describe('Dish List Table Page Component', () => {
    test('Dish list table component renders', () => {
        let testID = process.env.TEST_USER_ID;
        const wrapper = mount(
            <Router>
                <DishListTable userID={testID} />
            </Router>,
        );

        expect(wrapper.exists()).toBe(true);
        wrapper.unmount();
    });

    test('Should render add new dish form', async () => {
        let testID = process.env.TEST_USER_ID;

        const wrapper = mount(
            <Router>
                <DishListTable userID={testID} />
            </Router>,
        );

        expect(wrapper.children(AddDishForm).length).toEqual(0);

        wrapper.unmount();
    });
});
