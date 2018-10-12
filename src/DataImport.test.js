/* eslint-disable react/jsx-filename-extension,react/jsx-no-bind,no-undef */
/**
 * Created by Gerwin Bosch on 3-7-2017.
 */
import React from 'react';
import DataImport from './DataImport';
import * as enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
enzyme.configure({ adapter: new Adapter() });

describe('<DataImport/>', () => {
  let dataStore = [];
  let pageTriggered = false;
  const pageFunction = function () {
    pageTriggered = true;
  };
  const setData = function (data) {
    dataStore = data;
    expect(dataStore).toEqual([]);
  };
  it('renders without crashing', () => {
    const setMyData = function (data) {
      dataStore = data;
    };
    enzyme.shallow(
      <DataImport data={dataStore} setData={setMyData.bind(this)} pageFunction={pageFunction} />);
  });

  it('set Data', () => {
    dataStore = [];
    const setMyData = jest.fn();
    const wrapper = enzyme.shallow(
      <DataImport data={dataStore} setData={setMyData.bind(this)} pageFunction={pageFunction} />,
    );
    const tf = wrapper.find('input');
    const blob = new File(['gerwinbosch, x, y\nkaas,c,u'], 'test.csv');
    const target = {
      target: { files: [blob] },
    };
    tf.simulate('change', target);
    setTimeout(() => {
      expect(setMyData).toBeCalled();
      expect(setMyData).lastCalledWith([['gerwinbosch', 'x', 'y'], ['kaas', 'c', 'u'], []]);
    }, 15000);
  });
  it('Invalid filetype', () => {
    dataStore = [['gerwinbosch', 'x', 'y'], ['kaas', 'c', 'u'], []];
    const setMyData = jest.fn();
    const wrapper = enzyme.shallow(
      <DataImport data={dataStore} setData={setMyData.bind(this)} pageFunction={pageFunction} />,
    );
    const tf = wrapper.find('input');
    const blob = new File(['gerwinbosch, x, y\nkaas,c,u'], 'test.png');
    const target = {
      target: { files: [blob] },
    };
    tf.simulate('change', target);
    expect(setMyData).toBeCalled();
    expect(setMyData).lastCalledWith([], '');
  });
  it('No File selected', () => {
    dataStore = [['gerwinbosch', 'x', 'y'], ['kaas', 'c', 'u'], []];
    const setMyData = jest.fn();
    const wrapper = enzyme.shallow(
      <DataImport data={dataStore} setData={setMyData.bind(this)} pageFunction={pageFunction} />,
    );
    const tf = wrapper.find('input');
    const blob = new File([], '');
    const target = {
      target: { files: [blob] },
    };
    tf.simulate('change', target);
    expect(setMyData).toBeCalled();
    expect(setMyData).lastCalledWith([], '');
  });
  it('ContinueClick', () => {
    dataStore = [['gerwinbosch', 'x', 'y'], ['kaas', 'c', 'u'], []];
    const tempPageFunction = jest.fn();
    const wrapper = enzyme.shallow(
      <DataImport data={dataStore} setData={setData} pageFunction={tempPageFunction.bind(this)} />,
    );
    const tf = wrapper.find('#continue_button');
    tf.simulate('click');
    expect(tf.props().disabled).toBe(false);
    expect(tempPageFunction).toBeCalled();
  });

  it('Non continue click', () => {
    // Expect tempPagefunction not te be called
    dataStore = [];
    const tempPageFunction = jest.fn();
    const wrapper = enzyme.shallow(
      <DataImport data={dataStore} setData={setData} pageFunction={tempPageFunction.bind(this)} />,
    );
    const tf = wrapper.find('#continue_button');
    tf.simulate('click');
    expect(tf.props().disabled).toBe(true);
    expect(tempPageFunction).not.toBeCalled();
  });
});

