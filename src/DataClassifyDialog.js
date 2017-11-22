import React, { Component } from 'react';
import {
  Dialog, DropDownMenu, FlatButton, IconButton, MenuItem, Step,
  StepLabel,
  Stepper,
  TextField,
} from 'material-ui';
import PropTypes from 'prop-types';
import { ActionSearch } from 'material-ui/svg-icons/';

class DataClassifyDialog extends Component {
  constructor() {
    super();
    this.state = {
      searchText: '',
      stepIndex: 0,
      vocabPickerIndex: 0,
      results: [],
      lovAvailable: true,
    };
  }
  onVocabPicked = (_, index) => {
    this.setState({
      vocabPickerIndex: index,
    });
  };

  searchVocabulary = (e) => {
    const query = this.state.searchText;
    const tempState = this.state;
    e.preventDefault();
    fetch(
      `http://lov.okfn.org/dataset/lov/api/v2/term/search?q=${query}&type=class`)
      .then((response) => {
        if (!response.ok) {
          throw Error(response);
        }
        return response.json();
      })
      .then((json) => {
        tempState.results = json.results.map(
          item => ({
            uri: item.uri[0],
            vocabPrefix: item['vocabulary.prefix'][0],
            prefix: item.prefixedName[0],
          }),
        );
        if (tempState.results.length === 0) {
          tempState.error = 'No results found';
        }
        tempState.lovAvailable = true;
        this.setState(tempState);
      })
      .catch((ex) => {
        if (ex.statusText) {
          tempState.error = `Request failed due to ${ex}`;
        } else {
          tempState.error = 'LOV is currently not available';
          tempState.lovAvailable = false;
        }
        console.error('parsing failed', ex);
        this.setState(tempState);
      });
  };
  handlePick = () => {
    let result;
    if (this.state.lovAvailable) {
      result = this.state.results[this.state.vocabPickerIndex];
      result.name = result.prefix.split(':')[1];
    } else {
      let name = this.props.data.columnName;
      name = name.toLowerCase();
      name = name.replace(/ /g, '_');
      let uri = this.state.vocabDownText;
      uri = uri.toLowerCase();
      uri = uri.replace(/ /g, '_');
      result = {
        uri,
        name,
      };
    }
    this.props.finishCallBack(result, this.state.baseUri);
    this.resetDialog();
  };
  resetDialog = () => {
    this.setState({
      searchText: '',
      stepIndex: 0,
      vocabPickerIndex: 0,
      results: [],
      lovAvailable: true,
    });
  };


  renderDialogTableBody() {
    if (!this.state.lovAvailable) {
      return (<TextField
        id="emergencyTextField"
        name="Class URI"
        hintText="The class of the URI"
        onChange={this.onUriChange}
      />);
    }
    if (this.state.results.length) {
      const result = this.state.results.map((column, index) =>
        (<MenuItem
          key={column.prefix}
          value={index}
          label={column.prefix}
          primaryText={column.prefix}
        />));
      return (
        <DropDownMenu
          value={this.state.vocabPickerIndex}
          onChange={this.onVocabPicked}
          openImmediately
        >
          {result}
        </DropDownMenu>
      );
    }
    return <div />;
  }

  renderDialogBody() {
    const item = this.props.data;
    if (!item) {
      return <div />;
    }
    switch (this.state.stepIndex) {
      case 0:
        return (
          <div>
            <p>In this dialog, you can specify a base URI for your data.
                This base URI will be used to form URIs for data instances.</p>
            <p>There are 2 possibilities:</p>
            <ol type="1">
              <li>If you know that a column contains only unique values then you can just
                  submit a base URI. The values from the column will be added at the
                  end of the base URIs forming proper URIs for data instances.</li>
              <li>If a column already conatains proper URIs then leave this field empty.</li>
            </ol>
            <p>Column name: {item.columnName}</p>
            <p>Example value: {item.exampleValue}</p>
            <TextField
              name="Base-uri:"
              type="url"
              hintText="type a base URI here"
              onChange={(_, string) => this.setState({ baseUri: string })}
            />
          </div>

        );
      case 1:
        return (
          <div>
            <p>This dialog allows specifying the class of things described by the data.
                For example, if your data features people then you can use
              <em> foaf:Person </em> </p>
            <p>Examples are: person, company, animal etc.</p>
            <form onSubmit={this.searchVocabulary}>
              <TextField
                name="Search vocabularies"
                hintText="class name"
                onChange={(_, string) => this.setState({ searchText: string })}
                errorText={this.state.error}
              />
              <IconButton type="submit"><ActionSearch /></IconButton>
            </form>
            <p>Provide a class name in the field above and pick a term from the suggestions</p>
            <p> <em> Similar terms can be found in different vocabularies
                therefore try to use as few vocabularies as possible</em></p>
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
        label={(this.state.stepIndex === 0) ? 'Next' : 'Finish'}
        primary
        onClick={() => ((this.state.stepIndex === 0) ?
          this.setState({ stepIndex: 1 }) : this.handlePick())}
        disabled={(this.state.stepIndex === 0 || this.state.vocabDownText) ?
          false : !!(this.state.results.length === 0 || this.state.vocabDownText)}
      />,
      <FlatButton
        label="Cancel"
        primary={false}
        onClick={() => {
          this.resetDialog();
          this.props.closeCallBack();
        }}
      />,
    ];
    return (
      <Dialog
        actions={actions}
        modal
        open={this.props.open}
      >
        <Stepper activeStep={this.state.stepIndex}>
          <Step>
            <StepLabel>Pick URI</StepLabel>
          </Step>
          <Step>
            <StepLabel>Select class</StepLabel>
          </Step>
        </Stepper>
        {this.renderDialogBody()}
      </Dialog>

    );
  }
}
DataClassifyDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  closeCallBack: PropTypes.func.isRequired,
  finishCallBack: PropTypes.func.isRequired,
};

export default DataClassifyDialog;

