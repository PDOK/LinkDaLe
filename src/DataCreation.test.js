/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import { shallow } from 'enzyme';
import DataCreation from './DataCreation';

describe('<DataCreation/>', () => {
  const defaultExampleData =
    [['t0', 't1', 't2', 't3', 't4'],
        ['b0', 'b1', 'b2', '', 'b4'],
        ['c0', 'c1', 'c2', 'c3', 'c4'],
        ['d0', '', 'd2', '', 'd4'],
        ['e0', '', 'e2', 'e3', 'e4']];
  it('renders without crashing', () => {
    shallow(<DataCreation executeQuery={jest.fn()} />);
  });

  it('setData', () => {
    const wrapper = shallow(<DataCreation executeQuery={jest.fn()} />);
    const instance = wrapper.instance();
    instance.setData(defaultExampleData);
    expect(instance.state.data).toBe(defaultExampleData);
    expect(instance.state.dataClassifications[0]).toEqual(
        { columnName: 't0', exampleValue: 'b0', class: { name: 'Literal' }, uri: false });
  });

  it('getExampleData', () => {
    const wrapper = shallow(<DataCreation executeQuery={jest.fn()} />);
    const instance = wrapper.instance();
    instance.setData(defaultExampleData);
    const result = instance.getExampleData(0, 0);
    expect(result).toEqual({ max: 4, results: ['b0', 'c0', 'd0', 'e0'] });
  });

  it('getMaxTenData', () => {
    const data = [['title'], [1], [2], [3], [4], [5], [6], [7], [8], [9], [10], [11], [12], [13], [14], [15]];
    const wrapper = shallow(<DataCreation executeQuery={jest.fn()} />);
    const instance = wrapper.instance();
    instance.setData(data);
    let result = instance.getExampleData(0, 0);
    expect(result).toEqual({ max: 15, results: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] });
    result = instance.getExampleData(0, 1);
    expect(result).toEqual({ max: 15, results: [11, 12, 13, 14, 15] });
  });
  // Skipping setters
});
