import React from 'react';
import { Tabs, Tab } from 'material-ui/Tabs';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
import Paper from 'material-ui/Paper';
import PropTypes from 'prop-types';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import Download from 'material-ui/svg-icons/file/file-download';
import csvStringify from 'csv-stringify';


class SparqlVisualizer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      csvData: '',
    };
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps !== this.props) {
      csvStringify(
        nextProps.data.map(dataRow => (
          dataRow.map(val => val.value))), (error, output) => {
          if (!error) {
            this.setState({ csvData: output });
          }
        });
    }
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
      <div>
        <FloatingActionButton
          style={{
            position: 'absolute',
            bottom: '25px',
            right: '25px',
          }}
          href={`data:'text/plain';charset=utf-8,${encodeURIComponent(
            this.state.csvData)}`}
          download={'resultSet.csv'}
          disabled={this.props.data.length === 0}
        ><Download /></FloatingActionButton>
        <Tabs>
          {renderErrorBox}
          <Tab label="Table">
            <Table selectable={false} wrapperStyle={{ maxHeight: '48vh' }}>
              <TableHeader displaySelectAll={false}>
                <TableRow>
                  {this.props.headers.map(header =>
                    <TableHeaderColumn key={header}>{header}</TableHeaderColumn>)}
                </TableRow>
              </TableHeader>
              <TableBody
                displayRowCheckbox={false}
                style={{ maxHeight: '20vh' }}
                preScanRows={false}
              >
                {this.props.data.map(row => (
                  <TableRow key={row.map(data => data.value)}>
                    {row.map(data => <TableRowColumn key={data}>{data ? data.value : 'null'}</TableRowColumn>)}
                  </TableRow>))}
              </TableBody>
            </Table>
          </Tab>
        </Tabs>

      </div>
    );
  }
}
SparqlVisualizer.propTypes = {
  data: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.object)).isRequired,
  headers: PropTypes.arrayOf(PropTypes.string).isRequired,
  error: PropTypes.string,
};

SparqlVisualizer.defaultProps = {
  error: '',
};

export default SparqlVisualizer;
