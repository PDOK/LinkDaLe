import React, { Component } from 'react';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import PropTypes from 'prop-types';


class GraphContextForm extends Component {
  static encodeGraphName = (name) => {
    if (name) {
      const transformedName = name.replace(/ /g, '_');
      return encodeURI(transformedName);
    } return '';
  };
  constructor() {
    super();
    const today = new Date();
    this.state = {
      date: `${today.getDate()}-${today.getMonth() + 1}-${today.getUTCFullYear()}`,
      fileName: '',
      description: '',
    };
  }
  onSubmit = () => {
    this.props.onSubmitForm(
      this.state.fileName,
      this.state.description,
      this.state.date);
  };
  handleChange = (event, value) => {
    const target = event.target;
    switch (target.name) {
      case 'description':
        this.setState({ description: value });
        break;
      case 'title':
        this.setState({ fileName: value });
        break;
      default:
        console.error('unknown change', target.name);
    }
  };

  render() {
    const actions = [
      <FlatButton
        label="publish"
        disabled={this.state.fileName === ''}
        onClick={this.onSubmit}
        primary
      />,
      <FlatButton
        label="cancel"
        onClick={this.props.closeDialog}
      />,

    ];
    return (
      <Dialog open={this.props.open} actions={actions}>
        <TextField
          name="filename"
          value={`http://gerwinbosch.nl/rdf-paqt/data/${GraphContextForm.encodeGraphName(this.state.fileName)}`}
          floatingLabelText="URI of the dataset"
          disabled
          fullWidth
        />
        <br />
        <TextField
          type="text"
          name="title"
          floatingLabelText="Title of the dataset"
          onChange={this.handleChange}
          fullWidth
        />
        <br />
        <TextField
          name="description"
          type="text"
          multiLine
          rows={2}
          rowsMax={8}
          floatingLabelText="A small description of the dataset"
          onChange={this.handleChange}
          fullWidth
        />
        <br />
        <TextField
          type="text"
          name="date"
          floatingLabelText="Date of creation"
          value={this.state.date}
          fullWidth
          disabled
        />
      </Dialog>
    );
  }
}
GraphContextForm.propTypes = {
  onSubmitForm: PropTypes.func.isRequired,
  closeDialog: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};

export default GraphContextForm;

