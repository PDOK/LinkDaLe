/**
 * Created by Gerwin Bosch on 3-7-2017.
 */
import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import CheckBox from 'material-ui/Checkbox';
import Dialog from 'material-ui/Dialog';
import 'whatwg-fetch';
import IconButton from 'material-ui/IconButton';
import MenuItem from 'material-ui/MenuItem';
import ArrowBack from 'material-ui/svg-icons/navigation/arrow-back';
import PropTypes from 'prop-types';
import { SelectField } from 'material-ui';
import literalMap from './literalMapping';
import DataClassifyDialog from './DataClassifyDialog';

class DataClassifyView extends Component {
  constructor(props) {
    super(props);
    this.state = (
      {
        dialog: {
          open: false,
          id: 0,
          searchText: '',
          results: [],
          stepIndex: 0,
          vocabPickerIndex: 0,
          error: '',
          lovAvailable: true,
          vocabDownText: '',
        },
        uriDialog: {
          open: false,
          error: '',
          text: '',
        },
        tagDialog: {
          open: false,
          error: '',
          text: '',
        },
      }
    );
  }

  /* Renders the source link */

  onBaseUriChange = (index, text) => {
    this.props.setBaseUri(index, text);
  };

  onChange = (_, string) => {
    const dialog = this.state.dialog;
    dialog.searchText = string;
    this.setState({ dialog });
  };
  onUriChange = (_, string) => {
    const dialog = this.state.dialog;
    dialog.vocabDownText = string;
    this.setState({ dialog });
  };
  onTagChange = (_, string) => {
    const tagDialog = this.state.tagDialog;
    tagDialog.text = string;
    this.setState({ tagDialog });
  };
  onDialogUriChange = (_, string) => {
    const uriDialog = this.state.uriDialog;
    uriDialog.text = string;
    this.setState({ uriDialog });
  };

  getAmountOfClasses = () => {
    const classes = this.props.data.slice();
    if (classes.length === 0) return 0;
    let counter = 0;
    for (let i = 0; i < classes.length; i += 1) {
      const item = classes[i];
      if (item.uri) {
        counter += 1;
      }
    }
    return counter;
  };

  // Opens the dialog and set the row number of the item that was picked
  handleOpen = (i) => {
    const dialog = this.state.dialog;
    dialog.open = true;
    dialog.id = i;
    this.setState({
      dialog,
    });
  };

  resetItem(index) {
    this.props.setClass(index, { name: 'Literal' });
    this.props.setUri(index, false);
    this.props.setBaseUri(index, null);
  }

  handleColumnChange = (index, value) => {
    switch (value) {
      case 'Language tagged String':
        this.setState({ tagDialog: { open: true, column: index } });
        break;
      case 'Other':
        this.setState({ uriDialog: { open: true, column: index } });
        break;
      default:
        this.props.setLiteralType(index, value);
    }
  };
  finishCallBack = (classification, baseUri) => {
    if (baseUri) {
      this.props.setBaseUri(this.state.dialog.id, baseUri);
    }
    this.props.setClass(this.state.dialog.id, classification);
    this.props.setUri(this.state.dialog.id, true);
    this.setState({ dialog: { open: false, id: 0 } });
  };


  toNextPage() {
    this.props.nextPage(this.state.data);
  }

  continueDisabled() {
    return this.getAmountOfClasses() === 0;
  }

  startClassification(index) {
    this.handleOpen(index);
  }

  render() {
    const tagActions = [
      <FlatButton
        label="Finish"
        primary
        onClick={() => {
          const tagDialog = this.state.tagDialog;
          if (!tagDialog.text) {
            tagDialog.error = 'empty';
            this.setState({ tagDialog });
          } else {
            this.props.setLiteralType(this.state.tagDialog.column, { label: 'Language tagged String', value: this.state.tagDialog.text });
          }
          tagDialog.open = false;
          tagDialog.text = '';
          tagDialog.column = -1;
          this.setState(tagDialog);
        }}

      />,
    ];
    const uriActions = [
      <FlatButton
        label="Finish"
        primary
        onClick={() => {
          const uriDialog = this.state.uriDialog;
          if (!uriDialog.text) {
            uriDialog.error = 'empty';
            this.setState({ uriDialog });
          } else {
            this.props.setLiteralType(this.state.uriDialog.column, { label: 'Other', value: this.state.uriDialog.text });
          }
          uriDialog.open = false;
          uriDialog.text = '';
          uriDialog.column = -1;
          this.setState(uriDialog);
        }}
      />,
    ];
    return (
      <div>
        <Paper zDepth={2}>
          <div style={{ width: '100%', display: 'inline-block' }}>
            <FlatButton
              label="continue"
              disabled={this.continueDisabled()}
              onClick={() => this.toNextPage()}
              style={{
                float: 'right',
                margin: 14,
              }}
            />
          </div>

        </Paper>
        <Paper zDepth={1}>
          <Table selectable={false}>
            <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
              <TableRow>
                <TableHeaderColumn
                  tooltip="the column name"
                >Column Name</TableHeaderColumn>
                <TableHeaderColumn tooltip="The first value">Example Data
                    Value</TableHeaderColumn>
                <TableHeaderColumn tooltip="Is this a URI">Is it a URI?</TableHeaderColumn>
                <TableHeaderColumn tooltip="The type">Class of objects</TableHeaderColumn>
                <TableHeaderColumn tooltip="Base URI">Base
                    URI</TableHeaderColumn>
                <TableHeaderColumn tooltip="Reset">Reset</TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody displayRowCheckbox={false}>
              {
                this.props.data.map((column, index) =>
                  (<TableRow key={column.columnName}>
                    <TableRowColumn>{column.columnName}</TableRowColumn>
                    <TableRowColumn>{column.exampleValue}</TableRowColumn>
                    <TableRowColumn>
                      <CheckBox
                        checked={column.uri}
                        onCheck={() => this.startClassification(
                          index)}
                        disabled={column.uri}
                      />
                    </TableRowColumn>
                    <TableRowColumn>
                      {column.uri ? `URI : ${column.class.name}` :
                        (<SelectField
                          floatingLabelText="select types"
                          value={column.valueType}
                          onChange={(event, idx, value) => this.handleColumnChange(index, value)}
                        >
                          {literalMap.map(litDescr =>
                            (<MenuItem
                              key={litDescr.label}
                              label={litDescr.variableToAdd.length > 0 ? `${litDescr.variableToAdd[0]}:${column[litDescr.variableToAdd[0]]}` : litDescr.label}
                              value={litDescr.label}
                            >
                              {litDescr.label}
                            </MenuItem>),
                          )}
                        </SelectField>)

                      }
                    </TableRowColumn>
                    <TableRowColumn>
                      {column.baseUri ? column.baseUri : ''}
                    </TableRowColumn>
                    <TableRowColumn>
                      {
                        column.uri ?
                          (
                            <IconButton
                              onClick={() => this.resetItem(index)}
                            >
                              <ArrowBack />
                            </IconButton>
                          ) : <div />
                      }
                    </TableRowColumn>

                  </TableRow>),
                )
              }
            </TableBody>

          </Table>
        </Paper>
        <DataClassifyDialog
          open={this.state.dialog.open}
          data={this.props.data[this.state.dialog.id]}
          closeCallBack={() => this.setState({ dialog: { open: false, id: 0 } })}
          finishCallBack={this.finishCallBack}
        />
        <Dialog
          actions={tagActions}
          open={this.state.tagDialog.open}
          modal
        >
          Please enter a language tag according to the ISO 639 Standard ex. (en or nl)
          <TextField
            id="tagText"
            errorText={this.state.tagDialog.error}
            onChange={this.onTagChange}
          />

        </Dialog>
        <Dialog
          actions={uriActions}
          open={this.state.uriDialog.open}
          modal
        >
          Please enter a URI
          <TextField
            id="uriText"
            errorText={this.state.uriDialog.error}
            onChange={this.onDialogUriChange}
          />

        </Dialog>

      </div>
    );
  }
}

DataClassifyView.propTypes = {
  setBaseUri: PropTypes.func.isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  setClass: PropTypes.func.isRequired,
  setUri: PropTypes.func.isRequired,
  nextPage: PropTypes.func.isRequired,
  setLiteralType: PropTypes.func.isRequired,


};
export default DataClassifyView;
