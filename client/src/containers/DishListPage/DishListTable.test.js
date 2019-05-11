import React from 'react';
import Enzyme, {shallow, mount} from 'enzyme';
import DishListTable from './DishListTable';
import AddDishForm from '../../components/AddDishForm';
import Adapter from 'enzyme-adapter-react-16';
import {Row, Col, Container} from 'reactstrap';
import {BrowserRouter as Router} from 'react-router-dom';
import app from '../../base';
require('dotenv').config();

Enzyme.configure({adapter: new Adapter()});

//var firebasemock = require('firebase-mock');
//var mockauth = new firebasemock.MockAuthentication();

describe('Dish List Table Page Component', () => {
    test('Dish list table component renders', () => {
        const wrapper = shallow(<DishListTable />);

        expect(wrapper.exists()).toBe(true);
    });

    test('Should render add new dish form', async () => {
        let testID = process.env.TEST_USER_ID;

        const wrapper = mount(
            <Router>
                <DishListTable userID={testID} />
            </Router>,
        );

        expect(wrapper.children(AddDishForm).length).toEqual(1);

        wrapper.unmount();
    });
    /*
    test('Home component has 4 buttons', () => {
        const wrapper = mount(<Home />);
        var numberOfButtons = 4;

        expect(wrapper.find(CategoryButton)).toHaveLength(numberOfButtons);

        wrapper.unmount();
	});
	*/
});
