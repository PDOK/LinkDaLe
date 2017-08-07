/**
 * Created by Gerwin Bosch on 3-7-2017.
 */
import React from 'react';
import ReactDOM from 'react-dom';
// import * as X from './DataImport';
import App from './App';
import DataImport from './DataImport';
import ReactTestUtils from 'react-dom/test-utils'; // ES6
import ShallowRenderer from 'react-test-renderer/shallow'; // ES6
import { mount,shallow } from "enzyme";

describe("<DataImport/>", () => {
    it('renders without crashing', () => {
        const wrapper = shallow(<DataImport/>);
    });

    it('props setup', () => {
       const outer = mount(
           <App
           />);
       outer.setState({state:2})
        outer.find()
    });

});

