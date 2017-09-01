/* eslint-disable react/forbid-prop-types,react/jsx-filename-extension */
import React from 'react';
import { Tabs, Tab } from 'material-ui/Tabs';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
import PropTypes from 'prop-types';


function TripleVisualizer(props) {
  return (
    <Tabs>
      <Tab label="Table">
        <Table selectable={false} wrapperStyle={{ maxHeight: '45vh' }}>
          <TableHeader displaySelectAll={false}>
            <TableRow>
              <TableHeaderColumn>Subject</TableHeaderColumn>
              <TableHeaderColumn>Predicate</TableHeaderColumn>
              <TableHeaderColumn>Predicate</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody
            displayRowCheckbox={false}
            style={{ maxHeight: '20vh' }}
          >
            {props.data.map(row => (
              <TableRow >
                <TableRowColumn>{row[0]}</TableRowColumn>
                <TableRowColumn>{row[1]}</TableRowColumn>
                <TableRowColumn>{row[2]}</TableRowColumn>
              </TableRow>))}
          </TableBody>
        </Table>
      </Tab>
    </Tabs>
  );
}
TripleVisualizer.propTypes = {
  data: PropTypes.array.isRequired,
};

export default TripleVisualizer;
