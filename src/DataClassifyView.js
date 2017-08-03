/* eslint-disable react/jsx-no-bind,react/jsx-filename-extension,react/forbid-prop-types */
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
import ActionSearch from 'material-ui/svg-icons/action/search';
import { Step, Stepper, StepLabel } from 'material-ui/Stepper';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import ArrowBack from 'material-ui/svg-icons/navigation/arrow-back';
import PropTypes from 'prop-types';

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
      },
    }
    );
  }

  /* Renders the source link */

  onBaseUriChange(index, text) {
    this.props.setBaseUri(index, text);
  }

  onVocabPicked(e, index) {
    const dialog = this.state.dialog;
    dialog.vocabPickerIndex = index;
    this.setState({
      dialog,
    });
  }

  onChange(object, string) {
    const dialog = this.state.dialog;
    dialog.searchText = string;
    this.setState({ dialog });
  }

  getAmountOfClasses() {
    const classes = this.props.data.slice();
    let counter = 0;
    for (let i = 0; i < classes.length; i += 1) {
      const item = classes[i];
      if (item.uri) {
        counter += 1;
      }
    }
    return counter;
  }

  // Opens the dialog and set the row number of the item that was picked
  handleOpen(i) {
    const dialog = this.state.dialog;
    dialog.open = true;
    dialog.id = i;
    this.setState({
      dialog,
    });
  }

  handleClose() {
    const dialog = this.state.dialog;
    dialog.open = false;
    dialog.id = -1;
    dialog.stepIndex = 0;
    dialog.results = [];
    dialog.vocabPickerIndex = 0;
    this.setState({
      dialog,
    });
  }

  handleNext() {
    const dialog = this.state.dialog;
    dialog.stepIndex = 1;
    this.setState({
      dialog,
    });
  }

  searchVocabulary(e) {
    const query = this.state.dialog.searchText;
    const dialog = this.state.dialog;
    fetch(
        `http://lov.okfn.org/dataset/lov/api/v2/term/search?q=${query}&type=class`)
        .then(response => response.json())
        .then((json) => {
          dialog.results = json.results.map(
              item => ({
                uri: item.uri[0],
                vocabPrefix: item['vocabulary.prefix'][0],
                prefix: item.prefixedName[0],
              }),
          );
          this.setState({ dialog });
        })
        .catch((ex) => {
          console.log('parsing failed', ex);
        });
    e.preventDefault();
  }

  handlePick() {
    const dialog = this.state.dialog;
    const result = dialog.results[dialog.vocabPickerIndex];
    result.name = result.prefix.split(':')[1];
    this.props.setClass(this.state.dialog.id, result);
    this.props.setUri(this.state.dialog.id, true);
    this.setState({
      dialog: {
        open: false,
        id: 0,
        searchText: '',
        results: [],
        stepIndex: 0,
        vocabPickerIndex: 0,
      },
    },
    );
  }

  resetItem(index) {
    this.props.setClass(index, { name: 'Literal' });
    this.props.setUri(index, false);
    this.props.setBaseUri(index, null);
  }


  toNextPage() {
    this.props.nextPage(this.state.data);
  }

  continueDisabled() {
    return this.getAmountOfClasses() === 0;
  }

  startClassification(index) {
    this.handleOpen(index);
  }
  renderSourceLink(id) {
    const object = this.props.data[id];
    if (object.class.name !== 'Literal') {
      return <a href={object.class.uri}>{object.class.name}</a>;
    }
    return <div />;
  }

  renderDialogTableBody() {
    if (this.state.dialog.results.length) {
      const result = this.state.dialog.results.map((column, index) =>
          (<MenuItem
            key={column.prefix}
            value={index}
            label={column.prefix}
            primaryText={column.prefix}
          />));
      return (
        <DropDownMenu
          value={this.state.dialog.vocabPickerIndex}
          onChange={this.onVocabPicked.bind(this)}
          openImmediately
        >
          {result}
        </DropDownMenu>
      );
    }
    return <div />;
  }

  renderDialogBody() {
    const item = this.props.data[this.state.dialog.id];
    if (!item) {
      return <div />;
    }
    switch (this.state.dialog.stepIndex) {
      case 0:
        return (
          <div>
            <p>When the data is not a proper URI... Stans todo</p>
            <p>Column name: {item.columnName}</p>
            <p>Example value: {item.exampleValue}</p>
            <TextField
              name="Base-uri:"
              type="url"
              hintText="Input the URL from which the data will start"
              onChange={(event, string) => this.onBaseUriChange(
                      this.state.dialog.id, string)}
            />
          </div>

        );
      case 1:
        return (
          <div>
            <p>Some text written by stan goes here</p>
            <form onSubmit={this.searchVocabulary.bind(this)}>
              <TextField
                name="Search vocabularies"
                hintText="class name"
                onChange={this.onChange.bind(this)}
              />
              <IconButton type="submit"><ActionSearch /></IconButton>
            </form>
            <p>Some text written by stan goes here</p>
            {this.renderDialogTableBody()}

          </div>
        );
      default:
        return <div />;
    }
  }

  render() {
    const actions = [
      <FlatButton
        label={(this.state.dialog.stepIndex === 0) ? 'Next' : 'Finish'}
        primary
        onClick={(this.state.dialog.stepIndex === 0) ?
              this.handleNext.bind(this) : this.handlePick.bind(this)}
        disabled={(this.state.dialog.stepIndex === 0) ?
              false : this.state.dialog.results.length === 0}
      />,
      <FlatButton
        label="Cancel"
        primary={false}
        onClick={this.handleClose.bind(this)}
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
                >ColumnName</TableHeaderColumn>
                <TableHeaderColumn tooltip="The first value">Example
                    Value</TableHeaderColumn>
                <TableHeaderColumn tooltip="Is this a root node">Root
                    node</TableHeaderColumn>
                <TableHeaderColumn tooltip="The type">type</TableHeaderColumn>
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
                        <TableRowColumn>{column.class.name}</TableRowColumn>
                        <TableRowColumn>{column.baseUri ?
                            column.baseUri :
                            ''}</TableRowColumn>
                        <TableRowColumn>
                          {
                            column.uri ?
                                (
                                  <IconButton
                                    onClick={() => this.resetItem(index)}
                                  >
                                    <ArrowBack />
                                  </IconButton>
                                ) :
                                  <div />
                          }
                        </TableRowColumn>

                      </TableRow>),
                  )
                }
            </TableBody>

          </Table>
        </Paper>
        <Dialog
          actions={actions}
          modal
          open={this.state.dialog.open}
        >
          <Stepper activeStep={this.state.dialog.stepIndex}>
            <Step>
              <StepLabel>Pick URI</StepLabel>
            </Step>
            <Step>
              <StepLabel>Select class</StepLabel>
            </Step>
          </Stepper>
          {this.renderDialogBody()}
        </Dialog>
      </div>
    );
  }

}

DataClassifyView.propTypes = {
  setBaseUri: PropTypes.func.isRequired,
  data: PropTypes.array.isRequired,
  setClass: PropTypes.func.isRequired,
  setUri: PropTypes.func.isRequired,
  nextPage: PropTypes.func.isRequired,


};
export default DataClassifyView;
