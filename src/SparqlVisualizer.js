/* eslint-disable react/forbid-prop-types,react/jsx-filename-extension */
import React from 'react';
import { Tabs, Tab } from 'material-ui/Tabs';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
import Paper from 'material-ui/Paper';
import PropTypes from 'prop-types';

class SparqlVisualizer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nodes: [],
      edges: [],
      classNodes: [],
      classEdges: [],
      selected: {},
      selectedClass: {},

    };
  }

  render() {
    const renderErrorBox = this.props.error ? (
      <Tab label="Error">
        <Paper>
          <h1>Something went wrong</h1>
          {this.props.error}
        </Paper>
      </Tab>
    ) : (null);
    return (
      <Tabs>
        {renderErrorBox}
        <Tab label="Table">
          <Table selectable={false} wrapperStyle={{ maxHeight: '50vh' }}>
            <TableHeader displaySelectAll={false}>
              <TableRow>
                {this.props.headers.map(header =>
                  <TableHeaderColumn key={header}>{header}</TableHeaderColumn>)}
              </TableRow>
            </TableHeader>
            <TableBody
              displayRowCheckbox={false}
              style={{ maxHeight: '20vh' }}
            >
              {this.props.data.map(row => (
                <TableRow key={row.map(data => data.value)}>
                  {row.map(data => <TableRowColumn key={data}>{data ? data.value : 'null'}</TableRowColumn>)}
                </TableRow>))}
            </TableBody>
          </Table>
        </Tab>
      </Tabs>
    );
  }
}
SparqlVisualizer.propTypes = {
  data: PropTypes.array.isRequired,
  headers: PropTypes.array.isRequired,
  error: PropTypes.string,
};

SparqlVisualizer.defaultProps = {
  error: '',
};

export default SparqlVisualizer;
