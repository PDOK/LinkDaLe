/**
 * Created by Gerwin Bosch on 3-7-2017.
 */
import React from 'react';
import ReactDOM from 'react-dom';
import DataImport from './DataImport';
import csvToText from './DataImport';

it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<DataImport />, div);
});