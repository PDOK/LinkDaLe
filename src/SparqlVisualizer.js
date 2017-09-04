/* eslint-disable react/forbid-prop-types,react/jsx-filename-extension */
import React from 'react';
import { Tabs, Tab } from 'material-ui/Tabs';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
import PropTypes from 'prop-types';

class TripleVisualizer extends React.Component {
  constructor() {
    super();
    this.state = {
      nodes: [],
      edges: [],
      classNodes: [],
      classEdges: [],
      selected: {},
      selectedClass: {},

    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !(nextProps === this.props && nextState === this.state);
  }
  // Helper to find the index of a given node
  render() {
    return (
      <Tabs>
        <Tab label="Table">
          <Table selectable={false} wrapperStyle={{ maxHeight: '50vh' }}>
            <TableHeader displaySelectAll={false}>
              <TableRow>
                {this.props.headers.map(header => <TableHeaderColumn>{header}</TableHeaderColumn>)}
              </TableRow>
            </TableHeader>
            <TableBody
              displayRowCheckbox={false}
              style={{ maxHeight: '20vh' }}
            >
              {this.props.data.map(row => (
                <TableRow>
                  {row.map(data => <TableRowColumn>{data.value}</TableRowColumn>)}
                </TableRow>))}
            </TableBody>
          </Table>
        </Tab>
      </Tabs>
    );
  }
}
TripleVisualizer.propTypes = {
  data: PropTypes.array.isRequired,
  headers: PropTypes.array.isRequired,
};

export default TripleVisualizer;
