/* eslint-disable
react/forbid-prop-types,
react/jsx-filename-extension,
react/require-default-props */
/**
 * Created by Gerwin Bosch on 27-6-2017.
 */
import React, { Component } from 'react';
import FlatButton from 'material-ui/FlatButton/';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
import PropTypes from 'prop-types';
import Baby from 'babyparse';
import './DataImport.css';

const styles = {
  button: {
    margin: 12,
  },
  exampleImageInput: {
    cursor: 'pointer',
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    width: '100%',
    opacity: 0,
  },
};


function TableView(props) {
  if (props.data.length !== 0) {
    return (
      <Table
        className="myTable"
        bodyStyle={{ tableLayout: 'auto', overflowY: 'visible', overflowX: 'visible' }}
        headerStyle={{ OverflowX: 'visible', width: '100%', tableLayout: 'auto' }}
        wrapperStyle={{ width: '100%', overflowX: 'auto', display: 'inline-block', tableLayout: 'auto', maxHeight: '756px' }}
      >
        {/* Render the table header */}
        <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
          <TableRow key={0} style={{}}>
            {/* Create columns for every data */}
            {props.data[0].map(x => (
              <TableHeaderColumn key={x} style={{ width: '75px', maxWidth: '75px' }}>{x}</TableHeaderColumn>
              ))}
          </TableRow>

        </TableHeader>
        <TableBody displayRowCheckbox={false}>
          {/* Grab the rest of the data */}
          {props.data.slice(1, props.data.length).map((row, index) => (
                // Split the data in rows and columns
            <TableRow key={props.data[index]} style={{}}>{
                  row.map(x => (
                    <TableRowColumn key={x} style={{ width: '75px', maxWidth: '75px' }}>{x}</TableRowColumn>
                  ))}</TableRow>
            ))}
        </TableBody>
      </Table>
    );
    //    Return empty div
  }
  return (<p>No Data Loaded</p>);
}
TableView.propTypes = {
  data: PropTypes.array.isRequired,
};

class ImportView extends Component {
  constructor() {
    super();
    this.state = {
      import_file: '',
      data: '',
      selectedFile: 'No File selected',
    };

    this.handleFileChange = this.handleFileChange.bind(this);
  }


  handleFileChange(event) {
    const reader = new FileReader();
    if (event.target.files.length === 0) {
      this.setState({
        selectedFile: 'No file selected',
      });
      this.props.setData([]);
      return;
    }
// eslint-disable-next-line no-useless-escape
    if (event.target.files[0].name.split('\.').pop() !== 'csv') {
      this.setState({
        selectedFile: 'Wrong type of file selected',
      });
      this.props.setData([]);
      return;
    }
    reader.addEventListener('load', () => {
      console.log(Baby.parse(reader.result).data);
      Baby.parse(reader.result);
      this.props.setData(Baby.parse(reader.result).data);
    });
    if (event.target.files) {
      reader.readAsText(event.target.files[0], 'UTF-8');
      this.setState({
        selectedFile: event.target.files[0].name,
      });
    }
  }

  renderTable() {
    return <TableView data={this.props.data} />;
  }


  render() {
    const toContinue = this.props.data.length === 0;
    return (
      <div className="dataImport">
        <Paper zDepth={1}>
          <FlatButton
            label="Pick a file"
            labelPosition="before"
            style={styles.button}
            containerElement="label"
          >
            <TextField disabled hintText={this.state.selectedFile} />
            <input
              accept="csv"
              type="file"
              onChange={this.handleFileChange}
              style={styles.exampleImageInput}
            />
          </FlatButton>
          <FlatButton
            id="continue_button"
            label="continue"
            disabled={toContinue}
            style={{
              float: 'right',
              margin: 14,
            }}
            onClick={toContinue ? undefined : () => this.props.pageFunction(2)}
          />
        </Paper>
        <Paper zDepth={1} style={{ width: '100%' }}>
          {this.renderTable()}
        </Paper>

      </div>
    );
  }
}
ImportView.propTypes = {
  data: PropTypes.array,
  setData: PropTypes.func.isRequired,
  pageFunction: PropTypes.func.isRequired,


};

export default ImportView;
