import React from 'react';
import Enzyme, {shallow, mount} from 'enzyme';
import Home from './Home';
import Adapter from 'enzyme-adapter-react-16';
import CategoryButton from '../../components/CategoryButton';
import {Row, Col, Container} from 'reactstrap';

Enzyme.configure({adapter: new Adapter()});

describe('Home Component', () => {
    test('Home component renders', () => {
        const wrapper = shallow(<Home />);

        expect(wrapper.exists()).toBe(true);
    });

    test('Home component has 4 buttons', () => {
        const wrapper = mount(<Home />);
        var numberOfButtons = 4;

        expect(wrapper.find(CategoryButton)).toHaveLength(numberOfButtons);

        wrapper.unmount();
    });
});
