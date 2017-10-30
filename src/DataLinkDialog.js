import React, { Component } from 'react';
import {
  Dialog, DropDownMenu, FlatButton, IconButton, MenuItem,
  TextField,
} from 'material-ui';
import PropTypes from 'prop-types';
import { ActionSearch } from 'material-ui/svg-icons/';

class DataLinkDialog extends Component {
  constructor() {
    super();
    this.state = {
      searchText: '',
      results: [],
      lovAvailable: true,
      vocabPickerIndex: 0,
      error: '',
    };
  }
  onUriChange = (_, string) => {
    const dialog = this.state.dialog;
    dialog.vocabDownText = string;
    this.setState({ dialog });
  };
  onChange = (object, string) => {
    this.setState({ searchText: string });
  };
  handlePick = () => {
    let result;
    let name;
    if (this.state.lovAvailable) {
      result = this.state.results[this.state.vocabPickerIndex];
      name = result.prefix.split(':')[1];
    } else {
      name = this.state.dialog.vocabDownText;
      name = name.toLowerCase();
      name = name.replace(/ /g, '_');
      result = {
        uri: name,
        name,
        prefix: name,
      };
    }
    const newEdge = {
      source: this.props.source,
      target: this.props.target,
      relation: result.prefix,
      r: 30,
      type: 'emptyEdge',
      title: name,
      link: result.uri,
      vocabPrefix: result.vocabPrefix,
      prefix: result.prefix,
    };
    this.setState({
      searchText: '',
      results: [],
      lovAvailable: true,
      vocabPickerIndex: 0,
      error: '',
    });
    this.props.finishDialog(newEdge);
  };


  searchVocabulary = (e) => {
    const query = this.state.searchText;
    let results = [];
    e.preventDefault();
    fetch(`http://lov.okfn.org/dataset/lov/api/v2/term/search?q=${query
    }&type=property`)
      .then((response) => {
        if (!response.ok) {
          throw Error(response);
        }
        return response.json();
      })
      .then((json) => {
        results = json.results.map(
          item => ({
            uri: item.uri[0],
            vocabPrefix: item['vocabulary.prefix'][0],
            prefix: item.prefixedName[0],
          }),
        );
        if (results.length === 0) {
          this.setState({ error: 'No results found' });
        }
        this.setState({
          results,
          lovAvailable: true,
        });
      })
      .catch((ex) => {
        let error;
        let lovAvailable = true;
        if (ex.statusText) {
          error = `Request failed due to ${ex}`;
        } else {
          error = 'LOV is currently not available';
          lovAvailable = false;
        }
        console.error('parsing failed', ex);
        this.setState(error, lovAvailable);
      });
  };

  renderDialogTableBody() {
    if (!this.state.lovAvailable) {
      return (<TextField
        name="Relation URI"
        hintText="The relation of the URI"
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

  render() {
    const actions = [
      <FlatButton
        label={'Finish'}
        primary
        onClick={this.handlePick}
        disabled={!(this.state.results.length !== 0 || this.state.vocabDownText)}
      />,

      <FlatButton
        label="Cancel"
        onClick={() => {
          this.setState({
            searchText: '',
            results: [],
            lovAvailable: true,
            vocabPickerIndex: 0,
            error: '',
          });
          this.props.closeDialog();
        }}
      />,
    ];

    return (
      <Dialog
        actions={actions}
        modal
        open={this.props.open}
      >

        <div style={{ width: '100%' }}>
          <p>This dialog allows specifying relationships between data items that was linked.
          In RDF this is called a predicate.</p>
          <p>For example, <em> foaf:age </em> can be used to link a person to his/her age</p>
          <form onSubmit={this.searchVocabulary}>
            <TextField
              name="Search vocabularies"
              hintText="relation name"
              onChange={this.onChange}
              errorText={this.state.error}
            />
            <IconButton type="submit"><ActionSearch /></IconButton>
          </form>
          <p>Provide a relation name in the field above and pick a term from the suggestions</p>
          <p> <em> Similar terms can be found in different vocabularies
          therefore try to use as few vocabularies as possible</em></p>
          {this.renderDialogTableBody()}
        </div>

      </Dialog>);
  }
}

export default DataLinkDialog;

DataLinkDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  source: PropTypes.number.isRequired,
  target: PropTypes.number.isRequired,
  finishDialog: PropTypes.func.isRequired,
  closeDialog: PropTypes.func.isRequired,
};
