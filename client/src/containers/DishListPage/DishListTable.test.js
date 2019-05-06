import React from 'react';
import Enzyme, {shallow, mount} from 'enzyme';
import DishListTable from './DishListTable';
import Adapter from 'enzyme-adapter-react-16';
import {Row, Col, Container} from 'reactstrap';

Enzyme.configure({adapter: new Adapter()});

describe('Dish List Table Page Component', () => {
    test('Dish list table component renders', () => {
        const wrapper = shallow(<DishListTable />);

        expect(wrapper.exists()).toBe(true);
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
