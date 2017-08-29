/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import { shallow } from 'enzyme';
import App from './App';

it('renders without crashing', () => {
  shallow(<App />);
});

it('datastore did mount', () => {
  const wrapper = shallow(<App />);
  console.log(wrapper.graph);
});

