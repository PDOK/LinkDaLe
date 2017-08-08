/* eslint-disable react/jsx-filename-extension */
/**
 * Created by Gerwin Bosch on 3-7-2017.
 */
import React from 'react';
import { shallow } from 'enzyme';
import DataImport from './DataImport';

describe('<DataImport/>', () => {
  let dataStore = [];
  let pageTriggered = false;
  const pageFunction = function () {
    pageTriggered = true;
  };
  it('renders without crashing', () => {
    const setData = function (data) {
      dataStore = data;
    };
    shallow(
      <DataImport data={dataStore} setData={setData.bind(this)} pageFunction={pageFunction} />);
  });

  it('Set data', () => {
    dataStore = [];
    const setData = function (data) {
      dataStore = data;
      expect(dataStore).toBe([['gerwinbosch', 'x', 'y'], ['kaas', 'c', 'u'], []]);
    };
    const wrapper = shallow(
      <DataImport data={dataStore} setData={setData.bind(this)} pageFunction={pageFunction} />,
    );
    const tf = wrapper.find('input');
    const blob = new File(['gerwinbosch, x, y\nkaas,c,u'], 'test.csv');
    const target = {
      target: { files: [blob] },
    };
    tf.simulate('change', target);
  });
  it('Invalid filetype', () => {
    dataStore = [['gerwinbosch', 'x', 'y'], ['kaas', 'c', 'u'], []];
    const setData = function (data) {
      dataStore = data;
      expect(dataStore).toEqual([]);
    };
    const wrapper = shallow(
      <DataImport data={dataStore} setData={setData.bind(this)} pageFunction={pageFunction} />,
    );
    const tf = wrapper.find('input');
    const blob = new File(['gerwinbosch, x, y\nkaas,c,u'], 'test.png');
    const target = {
      target: { files: [blob] },
    };
    tf.simulate('change', target);
  });
  it('No File selected', () => {
    dataStore = [['gerwinbosch', 'x', 'y'], ['kaas', 'c', 'u'], []];
    const setData = function (data) {
      dataStore = data;
      expect(dataStore).toEqual([]);
    };
    const wrapper = shallow(
      <DataImport data={dataStore} setData={setData.bind(this)} pageFunction={pageFunction} />,
    );
    const tf = wrapper.find('input');
    const blob = new File([], '');
    const target = {
      target: { files: [blob] },
    };
    tf.simulate('change', target);
  });

});

